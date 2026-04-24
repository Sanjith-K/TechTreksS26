"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthButton from "../../components/AuthButton";
import {
    House,
    Map as MapIcon,
    GraduationCap,
    Heart,
    User,
    ArrowLeft,
    SlidersHorizontal,
    LocateFixed,
    X,
} from "lucide-react";
import { APIProvider, Map, Marker, useMap, InfoWindow } from "@vis.gl/react-google-maps";

function MapController({ userLocation }) {
    const map = useMap();
    useEffect(() => {
        if (map && userLocation) {
            map.panTo(userLocation);
            map.setZoom(17);
        }
    }, [map, userLocation]);
    return null;
}

export default function MapPage() {
    const router = useRouter();
    const [spaces, setSpaces] = useState([]);
    const [mapsApiKey, setMapsApiKey] = useState(null);
    const [search, setSearch] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        noise: null,     // "silent" | "quiet" | "moderate" | "lively"
        wifi: false,
        price: null,     // 1 | 2 | 3
        type: null,      // "cafe" | "library" | "lounge" | "outdoor"
    });

    useEffect(() => {
        fetch("/api/maps-key")
            .then((r) => r.json())
            .then((d) => { if (d.key) setMapsApiKey(d.key); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        async function loadSpaces() {
            try {
                const res = await fetch("/api/spaces/map");
                if (!res.ok) return;
                const data = await res.json();
                setSpaces(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        }
        loadSpaces();
    }, []);

    function handleUseMyLocation() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocationLoading(false);
            },
            () => {
                alert("Could not get your location. Please allow location access.");
                setLocationLoading(false);
            }
        );
    }

    function toggleFilter(key, value) {
        setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));
    }

    const filteredSpaces = spaces.filter((s) => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.noise && s.noise_level !== filters.noise) return false;
        if (filters.wifi && !s.wifi) return false;
        if (filters.price && s.price_range !== filters.price) return false;
        if (filters.type) {
            const tags = Array.isArray(s.tags)
                ? s.tags
                : typeof s.tags === "string"
                ? s.tags.split(",").map((t) => t.trim())
                : [];
            if (!tags.some((t) => t.toLowerCase().includes(filters.type))) return false;
        }
        return true;
    });

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#07152b] text-white">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            {/* Stars */}
            <div className="pointer-events-none absolute inset-0">
                {[...Array(60)].map((_, i) => {
                    const size = Math.random() * 2 + 1;
                    return (
                        <span
                            key={i}
                            className="star"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                            }}
                        />
                    );
                })}
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-8 pb-28 pt-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <Link href="/" className="flex items-end gap-1">
                        <h1 className="font-[Be1Logo5] text-5xl tracking-wide sm:text-6xl">Be1</h1>
                        <span className="font-[Be1Logo5] text-2xl tracking-wide text-white/70 sm:text-3xl">space</span>
                    </Link>
                    <AuthButton />
                </header>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/70 hover:text-white">
                    <Link href="/discover" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                {/* Header Card */}
                <section className="mt-6 rounded-3xl border border-white/8 bg-white/8 p-6 backdrop-blur-md">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold">Map</h1>
                            <p className="mt-2 text-white/55">
                                Explore study spots visually around NYU and nearby neighborhoods
                            </p>
                        </div>

                        <button
                            onClick={() => setShowFilters((v) => !v)}
                            className={`flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm transition ${
                                activeFilterCount > 0
                                    ? "border-purple-400/40 bg-purple-500/20 text-purple-200"
                                    : "border-white/10 bg-white/8 text-white/80 hover:bg-white/12"
                            }`}
                        >
                            <SlidersHorizontal size={16} />
                            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                        </button>
                    </div>

                    {/* Filter panel */}
                    {showFilters && (
                        <div className="mt-5 rounded-2xl border border-white/8 bg-white/5 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white/70">Filter spaces</span>
                                <button
                                    onClick={() => setFilters({ noise: null, wifi: false, price: null, type: null })}
                                    className="text-xs text-white/40 hover:text-white/70"
                                >
                                    Clear all
                                </button>
                            </div>

                            {/* Noise level */}
                            <div className="mt-3">
                                <p className="mb-2 text-xs text-white/50">Noise level</p>
                                <div className="flex flex-wrap gap-2">
                                    {["silent", "quiet", "moderate", "lively"].map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => toggleFilter("noise", n)}
                                            className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                                                filters.noise === n
                                                    ? "bg-purple-500 text-white"
                                                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mt-3">
                                <p className="mb-2 text-xs text-white/50">Type</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Cafe", value: "cafe" },
                                        { label: "Library", value: "library" },
                                        { label: "Lounge", value: "lounge" },
                                        { label: "Outdoor", value: "outdoor" },
                                    ].map(({ label, value }) => (
                                        <button
                                            key={value}
                                            onClick={() => toggleFilter("type", value)}
                                            className={`rounded-full px-3 py-1 text-xs transition ${
                                                filters.type === value
                                                    ? "bg-cyan-500 text-white"
                                                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price + WiFi */}
                            <div className="mt-3 flex flex-wrap gap-4">
                                <div>
                                    <p className="mb-2 text-xs text-white/50">Price</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => toggleFilter("price", p)}
                                                className={`rounded-full px-3 py-1 text-xs transition ${
                                                    filters.price === p
                                                        ? "bg-green-500 text-white"
                                                        : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                                                }`}
                                            >
                                                {"$".repeat(p)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs text-white/50">WiFi</p>
                                    <button
                                        onClick={() => toggleFilter("wifi", true)}
                                        className={`rounded-full px-3 py-1 text-xs transition ${
                                            filters.wifi
                                                ? "bg-blue-500 text-white"
                                                : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                                        }`}
                                    >
                                        WiFi only
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                        <input
                            type="text"
                            placeholder="Search places on the map..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-white/8 bg-white/8 px-5 py-4 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35"
                        />

                        <button
                            onClick={handleUseMyLocation}
                            disabled={locationLoading}
                            className="flex items-center justify-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-200 hover:bg-cyan-400/15 disabled:opacity-60"
                        >
                            <LocateFixed size={16} className={locationLoading ? "animate-spin" : ""} />
                            {locationLoading ? "Locating..." : "Use My Location"}
                        </button>
                    </div>

                    {filteredSpaces.length !== spaces.length && (
                        <p className="mt-3 text-xs text-white/40">
                            Showing {filteredSpaces.length} of {spaces.length} spaces
                        </p>
                    )}
                </section>

                {/* Map */}
                <section className="mt-6 overflow-hidden rounded-3xl border border-white/8 bg-white/8 p-4 backdrop-blur-md">
                    <div className="h-[65vh] overflow-hidden rounded-2xl">
                        {!mapsApiKey ? (
                            <div className="flex h-full items-center justify-center text-white/40 text-sm">Loading map…</div>
                        ) : (
                        <APIProvider apiKey={mapsApiKey}>
                            <Map
                                defaultCenter={{ lat: 40.7291, lng: -73.9965 }}
                                defaultZoom={15}
                                style={{ width: "100%", height: "100%" }}
                                gestureHandling="greedy"
                                onClick={() => setSelectedSpace(null)}
                            >
                                <MapController userLocation={userLocation} />

                                {/* User location dot */}
                                {userLocation && (
                                    <Marker
                                        position={userLocation}
                                        title="You are here"
                                        icon={{
                                            path: 0, // google.maps.SymbolPath.CIRCLE
                                            scale: 8,
                                            fillColor: "#22d3ee",
                                            fillOpacity: 1,
                                            strokeColor: "#fff",
                                            strokeWeight: 2,
                                        }}
                                    />
                                )}

                                {filteredSpaces.map((space) => (
                                    <Marker
                                        key={space.google_place_id}
                                        position={{ lat: space.latitude, lng: space.longitude }}
                                        title={space.name}
                                        onClick={() => setSelectedSpace(space)}
                                    />
                                ))}

                                {selectedSpace && (
                                    <InfoWindow
                                        position={{
                                            lat: selectedSpace.latitude,
                                            lng: selectedSpace.longitude,
                                        }}
                                        onCloseClick={() => setSelectedSpace(null)}
                                    >
                                        <div style={{ color: "#000", minWidth: 180 }}>
                                            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                                                {selectedSpace.name}
                                            </p>
                                            <p style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
                                                {selectedSpace.noise_level
                                                    ? `${selectedSpace.noise_level} • `
                                                    : ""}
                                                {selectedSpace.price_range
                                                    ? "$".repeat(selectedSpace.price_range)
                                                    : "Free"}
                                            </p>
                                            <a
                                                href={`/stores/${encodeURIComponent(selectedSpace.google_place_id)}`}
                                                style={{
                                                    display: "inline-block",
                                                    background: "#7c3aed",
                                                    color: "#fff",
                                                    borderRadius: 20,
                                                    padding: "4px 12px",
                                                    fontSize: 12,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                View details →
                                            </a>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Map>
                        </APIProvider>
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">
                    <Link href="/discover" className="flex flex-col items-center gap-1 hover:text-white">
                        <House size={20} /><span>discover</span>
                    </Link>
                    <Link href="/map" className="flex flex-col items-center gap-1 text-purple-400">
                        <MapIcon size={20} /><span>map</span>
                    </Link>
                    <Link href="/nyu" className="flex flex-col items-center gap-1 hover:text-white">
                        <GraduationCap size={20} /><span>NYU</span>
                    </Link>
                    <Link href="/favorites" className="flex flex-col items-center gap-1 hover:text-white">
                        <Heart size={20} /><span>favorites</span>
                    </Link>
                    <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-white">
                        <User size={20} /><span>profile</span>
                    </Link>
                </div>
            </nav>
        </main>
    );
}
