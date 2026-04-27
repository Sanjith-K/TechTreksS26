"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { APIProvider, Map, Marker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import AuthButton from "@/components/AuthButton";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { useAuth } from "@/context/AuthContext";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/favorites";
import { House, Map as MapIcon, GraduationCap, Heart, Search, User } from "lucide-react";

const ACCENT = "#7c3aed";

/** Data-URL: narrow purple map pin (18×28, ~40% narrower than 32×40 original) */
const PURPLE_PIN_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="28" viewBox="0 0 18 28">
<g transform="scale(0.5625 0.7)">
<path fill="${ACCENT}" stroke="#5b21b6" stroke-width="1" d="M16 0C7.2 0 0 6.4 0 14.2 0 24 16 40 16 40s16-16 16-25.8C32 6.4 24.8 0 16 0z"/>
<circle cx="16" cy="14" r="3.2" fill="#e9d5ff"/>
</g>
</svg>`
)}`;

const STAR_DOTS = Array.from({ length: 45 }, (_, i) => ({
    sz: `${1 + (i % 3)}px`,
    left: `${(i * 17) % 100}%`,
    top: `${(i * 23) % 100}%`,
    delay: `${(i % 10) * 0.3}s`,
}));

function parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
        try {
            return JSON.parse(tags);
        } catch {
            return tags.split(",").map((t) => t.trim()).filter(Boolean);
        }
    }
    return [];
}

function priceSymbols(range) {
    if (range == null) return "—";
    const n = Math.min(Math.max(Number(range) || 1, 1), 4);
    return "$".repeat(n);
}

function noiseLabel(v) {
    if (!v) return "—";
    return v.charAt(0).toUpperCase() + v.slice(1);
}

const NOISE_STEPS = [
    { value: "silent", label: "Silent" },
    { value: "quiet", label: "Quiet" },
    { value: "moderate", label: "Moderate" },
    { value: "lively", label: "Lively" },
];

function MapSearchInput({ search, onSearchChange }) {
    const inputRef = useRef(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const shouldRestoreRef = useRef(false);

    const handleInputChange = (e) => {
        const t = e.target;
        if (t.selectionStart != null && t.selectionEnd != null) {
            selectionRef.current = { start: t.selectionStart, end: t.selectionEnd };
        }
        shouldRestoreRef.current = true;
        onSearchChange(e);
    };

    useLayoutEffect(() => {
        if (!shouldRestoreRef.current || !inputRef.current) return;
        shouldRestoreRef.current = false;
        const { start, end } = selectionRef.current;
        const el = inputRef.current;
        el.focus({ preventScroll: true });
        try {
            if (el.setSelectionRange) {
                el.setSelectionRange(start, end);
            }
        } catch {
            /* ignore */
        }
    }, [search]);

    return (
        <div
            className="flex w-full min-w-0 items-center gap-2 rounded-full border-[1.5px] border-[rgba(255,255,255,0.15)] bg-white/[0.06] pl-2.5 pr-3 focus-within:border-[rgba(124,58,237,0.6)] focus-within:shadow-[0_0_0_1.5px_rgba(124,58,237,0.6)]"
            style={{ height: 40 }}
        >
            <Search
                className="pointer-events-none h-4 w-4 shrink-0 text-white/50"
                strokeWidth={2}
                aria-hidden
            />
            <input
                ref={inputRef}
                id="map-page-search-input"
                type="text"
                name="map-space-search"
                inputMode="search"
                enterKeyHint="search"
                value={search}
                onChange={handleInputChange}
                placeholder="Search spaces…"
                aria-label="Search spaces by name or address"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="min-w-0 w-full border-0 bg-transparent text-sm leading-none text-white outline-none ring-0 placeholder:text-white/35 focus:ring-0"
            />
        </div>
    );
}

function MapPanner({ space, token }) {
    const map = useMap();
    useEffect(() => {
        if (!map || !space || !token) return;
        const lat = Number(space.latitude);
        const lng = Number(space.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return;
        map.panTo({ lat, lng });
        map.setZoom(16);
    }, [map, space, token]);
    return null;
}

function SpaceInfoWindow({ space, onClose }) {
    const lat = Number(space.latitude);
    const lng = Number(space.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return (
        <InfoWindow position={{ lat, lng }} onCloseClick={onClose}>
            <div style={{ minWidth: 200, maxWidth: 240 }}>
                <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 14, margin: "0 0 8px 0" }}>{space.name}</p>
                <Link
                    href={`/stores/${encodeURIComponent(space.google_place_id)}`}
                    className="inline-block rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white no-underline transition hover:bg-violet-500"
                >
                    View details →
                </Link>
            </div>
        </InfoWindow>
    );
}

export default function MapPage() {
    const { user } = useAuth();
    const [spaces, setSpaces] = useState([]);
    const [search, setSearch] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [wifiOnly, setWifiOnly] = useState(false);
    const [noiseLevel, setNoiseLevel] = useState(null);
    const [nyuOnly, setNyuOnly] = useState(false);
    const [laptopOnly, setLaptopOnly] = useState(false);
    const filterRowRef = useRef(null);
    const [activeSpaceId, setActiveSpaceId] = useState(null);
    const [infoWindowSpace, setInfoWindowSpace] = useState(null);
    const [panToken, setPanToken] = useState(0);
    const [favoritedIds, setFavoritedIds] = useState(new Set());
    const cardRefs = useRef({});

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/spaces/map", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                setSpaces(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            }
        }
        load();
    }, []);

    useEffect(() => {
        if (!user?.id) {
            setFavoritedIds(new Set());
            return;
        }
        (async () => {
            try {
                const rows = await getFavorites(user.id);
                if (!Array.isArray(rows)) return;
                setFavoritedIds(
                    new Set(
                        rows.map((r) => r.space_id).filter(Boolean)
                    )
                );
            } catch {
                setFavoritedIds(new Set());
            }
        })();
    }, [user?.id]);

    const filteredSpaces = useMemo(() => {
        const q = search.trim().toLowerCase();
        return spaces.filter((s) => {
            if (q) {
                const name = (s.name || "").toLowerCase();
                const addr = (s.address || "").toLowerCase();
                if (!name.includes(q) && !addr.includes(q)) return false;
            }
            if (wifiOnly && !s.wifi) return false;
            if (noiseLevel) {
                const n = (s.noise_level || "").toLowerCase();
                if (n !== noiseLevel) return false;
            }
            if (nyuOnly && !s.nyu_discount) return false;
            if (laptopOnly && !s.laptop_friendly) return false;
            return true;
        });
    }, [spaces, search, wifiOnly, noiseLevel, nyuOnly, laptopOnly]);

    const scrollToCard = useCallback((id) => {
        const el = cardRefs.current[id];
        if (el) {
            el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        if (activeSpaceId) {
            scrollToCard(activeSpaceId);
        }
    }, [activeSpaceId, scrollToCard]);

    const onSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    useEffect(() => {
        if (!openDropdown) return;
        const onDocMouseDown = (e) => {
            if (filterRowRef.current && !filterRowRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [openDropdown]);

    const toggleDropdown = useCallback((id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    }, []);

    const onMarkerClick = useCallback(
        (space) => {
            setActiveSpaceId(space.google_place_id);
            setInfoWindowSpace(null);
        },
        []
    );

    const onListCardClick = useCallback(
        (space) => {
            setActiveSpaceId(space.google_place_id);
            setInfoWindowSpace(space);
            setPanToken((t) => t + 1);
        },
        []
    );

    const onMapClick = useCallback(() => {
        setInfoWindowSpace(null);
    }, []);

    const handleHeart = async (e, spaceId) => {
        e.stopPropagation();
        e.preventDefault();
        if (!user?.id) {
            alert("Please sign in to save favorites.");
            return;
        }
        try {
            if (favoritedIds.has(spaceId)) {
                await removeFavorite(user.id, spaceId);
                setFavoritedIds((prev) => {
                    const n = new Set(prev);
                    n.delete(spaceId);
                    return n;
                });
            } else {
                await addFavorite(user.id, spaceId);
                setFavoritedIds((prev) => new Set(prev).add(spaceId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const setCardRef = (id) => (el) => {
        if (el) cardRefs.current[id] = el;
        else delete cardRefs.current[id];
    };

    return (
        <main className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#07152b] text-white">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            .map-list-scroll { scrollbar-width: thin; scrollbar-color: rgba(124, 58, 237, 0.45) rgba(255, 255, 255, 0.06); }
            .map-list-scroll::-webkit-scrollbar { width: 6px; }
            .map-list-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.04); border-radius: 3px; }
            .map-list-scroll::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.45); border-radius: 3px; }`,
                }}
            />

            {/* Global background (gradient only; stars live in left column) */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
            </div>

            <div
                className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col"
                style={{ position: "relative", zIndex: 10 }}
            >
                <header
                    className="relative z-20 flex min-h-[60px] shrink-0 items-center gap-2 backdrop-blur-md sm:gap-3"
                    style={{
                        padding: "10px 16px",
                        background: "rgba(10, 15, 30, 0.95)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                >
                    <Link href="/" className="shrink-0 flex items-end gap-0.5 leading-none">
                        <span className="font-[Be1Logo5] text-2xl tracking-wide text-white">Be1</span>
                        <span className="font-[Be1Logo5] text-sm tracking-wide uppercase text-white/70">space</span>
                    </Link>
                    <div className="min-w-0 flex-1 px-1">
                        <MapSearchInput search={search} onSearchChange={onSearchChange} />
                    </div>
                    <div
                        ref={filterRowRef}
                        className="relative z-40 flex min-w-0 shrink-0 flex-nowrap items-center gap-1 sm:gap-1.5"
                        role="group"
                        aria-label="Filter spaces"
                    >
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown("wifi")}
                                className={`shrink-0 rounded-full border px-2 py-1 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:px-2.5 ${
                                    wifiOnly
                                        ? "border-[rgba(124,58,237,0.4)] text-white"
                                        : "border-white/10 bg-white/[0.05] text-white/80 hover:border-white/20"
                                }`}
                                style={wifiOnly ? { background: "rgba(124, 58, 237, 0.3)" } : undefined}
                                aria-expanded={openDropdown === "wifi"}
                            >
                                WiFi ▾
                            </button>
                            {openDropdown === "wifi" && (
                                <div
                                    className="absolute left-0 top-full mt-1 min-w-[200px] p-4"
                                    style={{
                                        zIndex: 9999,
                                        background: "#1a1f35",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: 12,
                                    }}
                                >
                                    <ToggleSwitch
                                        checked={wifiOnly}
                                        onChange={setWifiOnly}
                                        label="Free WiFi only"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown("noise")}
                                className={`shrink-0 rounded-full border px-2 py-1 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:px-2.5 ${
                                    noiseLevel != null
                                        ? "border-[rgba(124,58,237,0.4)] text-white"
                                        : "border-white/10 bg-white/[0.05] text-white/80 hover:border-white/20"
                                }`}
                                style={noiseLevel != null ? { background: "rgba(124, 58, 237, 0.3)" } : undefined}
                                aria-expanded={openDropdown === "noise"}
                            >
                                Noise ▾
                            </button>
                            {openDropdown === "noise" && (
                                <div
                                    className="absolute left-0 top-full mt-1 min-w-[280px] p-4"
                                    style={{
                                        zIndex: 9999,
                                        background: "#1a1f35",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: 12,
                                    }}
                                >
                                    <p className="mb-2 text-xs font-medium text-white/55">Noise level</p>
                                    <div className="flex w-full overflow-hidden rounded-lg border border-white/10" role="group" aria-label="Noise level">
                                        {NOISE_STEPS.map(({ value, label }, i) => {
                                            const selected = noiseLevel === value;
                                            return (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => {
                                                        setNoiseLevel((prev) => (prev === value ? null : value));
                                                    }}
                                                    className={`min-w-0 flex-1 border-white/10 px-1.5 py-2.5 text-center text-[10px] font-medium leading-tight sm:px-2 sm:text-xs ${
                                                        i > 0 ? "border-l" : ""
                                                    } ${
                                                        selected
                                                            ? "bg-[#7c3aed] text-white"
                                                            : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown("nyu")}
                                className={`shrink-0 rounded-full border px-2 py-1 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:px-2.5 ${
                                    nyuOnly
                                        ? "border-[rgba(124,58,237,0.4)] text-white"
                                        : "border-white/10 bg-white/[0.05] text-white/80 hover:border-white/20"
                                }`}
                                style={nyuOnly ? { background: "rgba(124, 58, 237, 0.3)" } : undefined}
                                aria-expanded={openDropdown === "nyu"}
                            >
                                NYU Discount ▾
                            </button>
                            {openDropdown === "nyu" && (
                                <div
                                    className="absolute left-0 top-full mt-1 min-w-[220px] p-4"
                                    style={{
                                        zIndex: 9999,
                                        background: "#1a1f35",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: 12,
                                    }}
                                >
                                    <ToggleSwitch
                                        checked={nyuOnly}
                                        onChange={setNyuOnly}
                                        label="NYU Discount only"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown("laptop")}
                                className={`shrink-0 rounded-full border px-2 py-1 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:px-2.5 ${
                                    laptopOnly
                                        ? "border-[rgba(124,58,237,0.4)] text-white"
                                        : "border-white/10 bg-white/[0.05] text-white/80 hover:border-white/20"
                                }`}
                                style={laptopOnly ? { background: "rgba(124, 58, 237, 0.3)" } : undefined}
                                aria-expanded={openDropdown === "laptop"}
                            >
                                Laptop OK ▾
                            </button>
                            {openDropdown === "laptop" && (
                                <div
                                    className="absolute left-0 top-full mt-1 min-w-[220px] p-4"
                                    style={{
                                        zIndex: 9999,
                                        background: "#1a1f35",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: 12,
                                    }}
                                >
                                    <ToggleSwitch
                                        checked={laptopOnly}
                                        onChange={setLaptopOnly}
                                        label="Laptop friendly only"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="shrink-0">
                        <AuthButton />
                    </div>
                </header>

                {/* Split: list | map — z-0 so header+dropdowns (z-20) always paint above this row */}
                <div className="relative z-0 flex min-h-0 min-w-0 flex-1">
                    {/* Left: 40% list with stars + cards */}
                    <aside className="relative w-2/5 min-w-0 border-r border-white/10">
                        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                            {STAR_DOTS.map((d, i) => (
                                <span
                                    key={i}
                                    className="star"
                                    style={{
                                        width: d.sz,
                                        height: d.sz,
                                        left: d.left,
                                        top: d.top,
                                        animationDelay: d.delay,
                                    }}
                                />
                            ))}
                        </div>
                        <div
                            className="map-list-scroll h-full overflow-y-auto overflow-x-visible px-2 py-3 sm:px-3"
                            style={{ position: "relative", zIndex: 1, overflowX: "visible" }}
                        >
                            {filteredSpaces.length === 0 ? (
                                <p className="px-1 text-sm text-white/40">No spaces match your filters.</p>
                            ) : (
                                filteredSpaces.map((space) => {
                                    const id = space.google_place_id;
                                    const tags = parseTags(space.tags);
                                    const isActive = activeSpaceId === id;
                                    const isFav = favoritedIds.has(id);
                                    return (
                                        <div
                                            key={id}
                                            ref={setCardRef(id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    onListCardClick(space);
                                                }
                                            }}
                                            onClick={() => onListCardClick(space)}
                                            className={`mb-2 flex w-full cursor-pointer rounded-lg border p-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 sm:p-3 ${
                                                isActive
                                                    ? "border-[1.5px] border-[#7c3aed] bg-[rgba(255,255,255,0.05)]"
                                                    : "border border-white/[0.08] bg-[rgba(255,255,255,0.05)] hover:border-white/15"
                                            } [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]`}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-white">
                                                    {space.name}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-white/45">
                                                    {space.address || "—"}
                                                </p>
                                                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                                                    {tags.slice(0, 4).map((tag, ti) => (
                                                        <span
                                                            key={`${id}-tag-${ti}`}
                                                            className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/55"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 text-xs text-amber-200/80">
                                                        <span>{priceSymbols(space.price_range)}</span>
                                                        <span className="rounded border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-200">
                                                            {noiseLabel(space.noise_level)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleHeart(e, id)}
                                                        className="shrink-0 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
                                                        aria-label={isFav ? "Remove favorite" : "Add favorite"}
                                                        aria-pressed={isFav}
                                                    >
                                                        <Heart
                                                            size={16}
                                                            className={isFav ? "fill-rose-400 text-rose-300" : ""}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </aside>

                    {/* Right: 60% map, flush */}
                    <div className="relative h-full min-h-0 w-3/5 min-w-0">
                        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                            <Map
                                defaultCenter={{ lat: 40.7291, lng: -73.9965 }}
                                defaultZoom={15}
                                style={{ width: "100%", height: "100%" }}
                                gestureHandling="greedy"
                                onClick={onMapClick}
                            >
                                <MapPanner space={infoWindowSpace} token={panToken} />
                                {filteredSpaces.map((space) => {
                                    const lat = Number(space.latitude);
                                    const lng = Number(space.longitude);
                                    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
                                    return (
                                        <Marker
                                            key={space.google_place_id}
                                            position={{ lat, lng }}
                                            title={space.name}
                                            onClick={() => onMarkerClick(space)}
                                            icon={{ url: PURPLE_PIN_URL }}
                                        />
                                    );
                                })}

                                {infoWindowSpace && (
                                    <SpaceInfoWindow
                                        space={infoWindowSpace}
                                        onClose={() => setInfoWindowSpace(null)}
                                    />
                                )}
                            </Map>
                        </APIProvider>
                    </div>
                </div>
            </div>

            {/* Bottom nav */}
            <nav className="relative z-20 shrink-0 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">
                    <Link href="/discover" className="flex flex-col items-center gap-1 hover:text-white">
                        <House size={20} />
                        <span>discover</span>
                    </Link>
                    <Link
                        href="/map"
                        className="flex flex-col items-center gap-1 text-purple-400"
                        aria-current="page"
                    >
                        <MapIcon size={20} />
                        <span>map</span>
                    </Link>
                    <Link href="/nyu" className="flex flex-col items-center gap-1 hover:text-white">
                        <GraduationCap size={20} />
                        <span>NYU</span>
                    </Link>
                    <Link href="/favorites" className="flex flex-col items-center gap-1 hover:text-white">
                        <Heart size={20} />
                        <span>favorites</span>
                    </Link>
                    <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-white">
                        <User size={20} />
                        <span>profile</span>
                    </Link>
                </div>
            </nav>
        </main>
    );
}
