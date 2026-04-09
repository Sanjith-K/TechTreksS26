"use client";

import { useEffect, useMemo, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/favorites";
import Stars from "../../components/Stars";
import { getSpaces } from "@/lib/spaces";
import Link from "next/link";
import SpaceCard from "../../components/SpaceCard";
import {
    House,
    Map,
    GraduationCap,
    Heart,
    User,
    SlidersHorizontal,
    ArrowUpDown,
} from "lucide-react";

const PRICE_MAP = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };
const CATEGORY_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Cafes", value: "cafe" },
    { label: "Libraries", value: "library" },
    { label: "Coworking", value: "coworking" },
    { label: "Lounges", value: "lounge" },
];

function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
}

function inferCategory(space) {
    const haystack = [
        space.name,
        space.address,
        ...(Array.isArray(space.tags) ? space.tags : []),
        space.raw?.place_type,
        space.raw?.category,
        space.raw?.types,
    ]
        .flat()
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (
        haystack.includes("library") ||
        haystack.includes("bobst")
    ) {
        return "library";
    }

    if (
        haystack.includes("cowork") ||
        haystack.includes("workspace")
    ) {
        return "coworking";
    }

    if (
        haystack.includes("lounge") ||
        haystack.includes("common room")
    ) {
        return "lounge";
    }

    return "cafe";
}

function getPriceLevel(space) {
    if (typeof space.raw?.price_range === "number") {
        return space.raw.price_range;
    }

    return Object.entries(PRICE_MAP).find(([, label]) => label === space.price)?.[0]
        ? Number(Object.entries(PRICE_MAP).find(([, label]) => label === space.price)?.[0])
        : 1;
}

function getNumericRating(space) {
    const rawRating = Number(space.raw?.rating ?? space.rating);
    return Number.isFinite(rawRating) ? rawRating : 0;
}

function compareSpaces(a, b, sortBy) {
    switch (sortBy) {
        case "name":
            return a.name.localeCompare(b.name);
        case "price-low":
            return getPriceLevel(a) - getPriceLevel(b) || a.name.localeCompare(b.name);
        case "price-high":
            return getPriceLevel(b) - getPriceLevel(a) || a.name.localeCompare(b.name);
        case "rating":
            return getNumericRating(b) - getNumericRating(a) || a.name.localeCompare(b.name);
        default:
            return (
                Number(b.nyu_discount) - Number(a.nyu_discount) ||
                getNumericRating(b) - getNumericRating(a) ||
                getPriceLevel(a) - getPriceLevel(b) ||
                a.name.localeCompare(b.name)
            );
    }
}

function matchesSearch(space, query) {
    if (!query) return true;

    const haystack = [
        space.name,
        space.address,
        space.vibe,
        ...(Array.isArray(space.tags) ? space.tags : []),
        space.category,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return haystack.includes(query);
}

function toggleBudgetPrice(currentValue) {
    return Number(currentValue) <= 2 ? 4 : 2;
}

function mapSpace(s) {
    let tags = [];
    if (typeof s.tags === "string" && s.tags) {
        try {
            tags = JSON.parse(s.tags);
        } catch {
            tags = s.tags.split(",").map((t) => t.trim());
        }
    } else if (Array.isArray(s.tags)) {
        tags = s.tags;
    }

    return {
        id: s.google_place_id || s.id,
        name: s.name,
        address: s.address || "",
        rating: s.rating || "—",
        price: PRICE_MAP[s.price_range] || "$",
        vibe: s.vibe || s.noise_level || "—",
        distance: s.distance || "—",
        tags,
        nyu_discount: !!s.nyu_discount,
        raw: s,
    };
}

function Section({
    title,
    spaces,
    loading,
    hide,
    favoriteIds = [],
    onToggleFavorite,
}) {
    if (hide) return null;

    if (loading) {
        return (
            <section className="mt-8">
                <h2 className="mb-4 text-3xl font-semibold text-white">{title}</h2>
                <p className="text-white/50">Loading...</p>
            </section>
        );
    }

    return (
        <section className="mt-8">
            <h2 className="mb-4 text-3xl font-semibold text-white">{title}</h2>
            {spaces.length === 0 ? (
                <p className="text-white/40">No spaces found.</p>
            ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {spaces.map((space) => (
                        <Link key={space.id} href={`/stores/${space.id}`} className="block">
                            <SpaceCard
                                name={space.name}
                                address={space.address}
                                rating={space.rating}
                                price={space.price}
                                vibe={space.vibe}
                                distance={space.distance}
                                tags={space.tags}
                                isFavorited={favoriteIds.includes(space.id)}
                                onToggleFavorite={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleFavorite?.(space.id);
                                }}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function DiscoverPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [showExtraPanel, setShowExtraPanel] = useState(false);
    const [allSpaces, setAllSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceValue, setPriceValue] = useState(4);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("recommended");

    const [filters, setFilters] = useState({
        wifi: false,
        noise_level: "",
        laptop_friendly: false,
        nyu_discount: false,
    });

    async function loadSpaces(activeFilters = {}) {
        try {
            setLoading(true);

            const backendFilters = {};

            if (activeFilters.wifi) backendFilters.wifi = true;
            if (activeFilters.noise_level) backendFilters.noise_level = activeFilters.noise_level;
            if (activeFilters.laptop_friendly) backendFilters.laptop_friendly = true;
            if (activeFilters.nyu_discount) backendFilters.nyu_discount = true;

            const data = await getSpaces(backendFilters);
            const mapped = Array.isArray(data) ? data.map(mapSpace) : [];
            setAllSpaces(
                mapped.map((space) => ({
                    ...space,
                    category: inferCategory(space),
                }))
            );
        } catch (err) {
            console.error("Failed to fetch spaces:", err);
        } finally {
            setLoading(false);
        }
    }

    async function toggleFavorite(spaceId) {
        try {
            const user =
                typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("user"))
                    : null;

            if (!user?.id) {
                alert("Please sign in first.");
                return;
            }

            if (favoriteIds.includes(spaceId)) {
                await removeFavorite(user.id, spaceId);
                setFavoriteIds((prev) => prev.filter((id) => id !== spaceId));
            } else {
                await addFavorite(user.id, spaceId);
                setFavoriteIds((prev) => [...prev, spaceId]);
            }
        } catch (err) {
            console.error("Favorite toggle failed:", err);
        }
    }

    useEffect(() => {
        async function init() {
            const user =
                typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("user"))
                    : null;

            if (user?.id) {
                try {
                    const favorites = await getFavorites(user.id);
                    const ids = Array.isArray(favorites)
                        ? favorites.map((f) => f.space_id)
                        : [];
                    setFavoriteIds(ids);
                } catch (err) {
                    console.error("Failed to load favorites:", err);
                }
            }
        }

        init();
    }, []);

    useEffect(() => {
        loadSpaces(filters);
    }, [filters]);

    const visibleSpaces = useMemo(() => {
        const normalizedQuery = normalizeText(searchQuery);

        return [...allSpaces]
            .filter((space) => matchesSearch(space, normalizedQuery))
            .filter((space) => selectedCategory === "all" || space.category === selectedCategory)
            .filter((space) => getPriceLevel(space) <= Number(priceValue))
            .sort((a, b) => compareSpaces(a, b, sortBy));
    }, [allSpaces, priceValue, searchQuery, selectedCategory, sortBy]);

    function toggleBooleanFilter(key) {
        setFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function setNoiseFilter(value) {
        setFilters((prev) => ({
            ...prev,
            noise_level: prev.noise_level === value ? "" : value,
        }));
    }

    function clearFilters() {
        setFilters({
            wifi: false,
            noise_level: "",
            laptop_friendly: false,
            nyu_discount: false,
        });
        setSearchQuery("");
        setSelectedCategory("all");
        setSortBy("recommended");
        setPriceValue(4);
        setShowExtraPanel(false);
        setShowFilters(false);
    }

    function applyFilters() {
        setShowExtraPanel(false);
        setShowFilters(false);
    }

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#07152b] text-white">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            <Stars />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pb-36 pt-6">
                <header className="flex items-center justify-between">
                    <div className="flex items-end gap-1">
                        <h1 className="font-[Be1Logo5] text-5xl tracking-wide sm:text-6xl">
                            Be1
                        </h1>
                        <span className="font-[Be1Logo5] text-2xl tracking-wide text-white/70 sm:text-3xl">
                            space
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </header>

                <div className="mt-6">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search cafes, libraries, spaces..."
                            className="w-full rounded-full border border-white/8 bg-white/8 px-5 py-4 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35"
                        />

                        <label className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/80 backdrop-blur-md">
                            <ArrowUpDown size={16} />
                            <span className="sr-only">Sort spaces</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="cursor-pointer bg-transparent text-white outline-none"
                            >
                                <option className="bg-[#0f1b33]" value="recommended">Recommended</option>
                                <option className="bg-[#0f1b33]" value="rating">Highest rated</option>
                                <option className="bg-[#0f1b33]" value="price-low">Price: Low to High</option>
                                <option className="bg-[#0f1b33]" value="price-high">Price: High to Low</option>
                                <option className="bg-[#0f1b33]" value="name">Name: A-Z</option>
                            </select>
                        </label>
                    </div>

                    <p className="mt-3 text-white/60">Near NYU Washington Square</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                                    selectedCategory === category.value
                                        ? "border-blue-400 bg-blue-600 text-white"
                                        : "border-white/10 bg-white/8 text-white/80"
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <button
                            onClick={() => toggleBooleanFilter("wifi")}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${filters.wifi
                                    ? "border-blue-400 bg-blue-600 text-white"
                                    : "border-white/10 bg-white/8 text-white/80"
                                }`}
                        >
                            WiFi
                        </button>

                        <button
                            onClick={() => setNoiseFilter("quiet")}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${filters.noise_level === "quiet"
                                    ? "border-blue-400 bg-blue-600 text-white"
                                    : "border-white/10 bg-white/8 text-white/80"
                                }`}
                        >
                            Quiet
                        </button>

                        <button
                            onClick={() => setPriceValue((prev) => toggleBudgetPrice(prev))}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                                Number(priceValue) <= 2
                                    ? "border-blue-400 bg-blue-600 text-white"
                                    : "border-white/10 bg-white/8 text-white/80"
                            }`}
                        >
                            Budget
                        </button>

                        <button
                            type="button"
                            disabled
                            title="Open now filtering is not available from the current data source yet."
                            className="cursor-not-allowed rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/40"
                        >
                            Open Now
                        </button>

                        <button
                            onClick={() => toggleBooleanFilter("nyu_discount")}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${filters.nyu_discount
                                    ? "border-blue-400 bg-blue-600 text-white"
                                    : "border-white/10 bg-white/8 text-white/80"
                                }`}
                        >
                            NYU Discount
                        </button>

                        <button
                            onClick={() => toggleBooleanFilter("laptop_friendly")}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${filters.laptop_friendly
                                    ? "border-blue-400 bg-blue-600 text-white"
                                    : "border-white/10 bg-white/8 text-white/80"
                                }`}
                        >
                            Laptop OK
                        </button>

                        <button
                            onClick={() => setShowExtraPanel(true)}
                            className="cursor-pointer rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 hover:bg-white/12"
                        >
                            etc.
                        </button>
                    </div>

                    {showExtraPanel && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-full max-w-3xl rounded-2xl border border-white/8 bg-[#0f1b33]/85 p-6 shadow-[0_0_40px_rgba(59,130,246,0.18)] backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                                    <button
                                        onClick={() => setShowExtraPanel(false)}
                                        className="cursor-pointer text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Noise Level</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {["quiet", "moderate", "lively"].map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => setNoiseFilter(item)}
                                                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${filters.noise_level === item
                                                        ? "border-blue-400 bg-blue-600 text-white"
                                                        : "border-white/10 bg-white/8 text-white/80"
                                                    }`}
                                            >
                                                {item.charAt(0).toUpperCase() + item.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Features</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => toggleBooleanFilter("wifi")}
                                            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${filters.wifi
                                                    ? "border-blue-400 bg-blue-600 text-white"
                                                    : "border-white/10 bg-white/8 text-white/80"
                                                }`}
                                        >
                                            WiFi
                                        </button>

                                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-sm text-white/80">
                                            Outlets
                                        </button>

                                        <button
                                            onClick={() => toggleBooleanFilter("laptop_friendly")}
                                            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${filters.laptop_friendly
                                                    ? "border-blue-400 bg-blue-600 text-white"
                                                    : "border-white/10 bg-white/8 text-white/80"
                                                }`}
                                        >
                                            Laptop
                                        </button>

                                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-sm text-white/80">
                                            Bathroom
                                        </button>

                                        <button
                                            onClick={() => toggleBooleanFilter("nyu_discount")}
                                            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${filters.nyu_discount
                                                    ? "border-blue-400 bg-blue-600 text-white"
                                                    : "border-white/10 bg-white/8 text-white/80"
                                                }`}
                                        >
                                            NYU Discount
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Price</h4>
                                    <div className="mt-2 flex gap-2">
                                        {[1, 2, 3, 4].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setPriceValue(level)}
                                                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${
                                                    Number(priceValue) === level
                                                        ? "border-blue-400 bg-blue-600 text-white"
                                                        : "border-white/10 bg-white/8 text-white/80"
                                                }`}
                                            >
                                                {PRICE_MAP[level]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 cursor-pointer rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-6">
                    <aside
                        className={`shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-white/8 backdrop-blur-md transition-all duration-300 ${showFilters
                                ? "w-[280px] p-5 opacity-100"
                                : "w-0 border-transparent p-0 opacity-0"
                            }`}
                    >
                        {showFilters && (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-semibold">Filters</h2>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="cursor-pointer text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-white/85">Price Range</h3>
                                        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-300">
                                            Up to {PRICE_MAP[Number(priceValue)]}
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min="1"
                                        max="4"
                                        step="1"
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(Number(e.target.value))}
                                        className="mt-4 w-full accent-blue-500"
                                    />

                                    <div className="mt-2 flex justify-between text-sm text-white/60">
                                        <span>$</span>
                                        <span>{PRICE_MAP[Number(priceValue)]}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Vibe</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.noise_level === "quiet"}
                                                onChange={() => setNoiseFilter("quiet")}
                                            />
                                            Quiet
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.noise_level === "moderate"}
                                                onChange={() => setNoiseFilter("moderate")}
                                            />
                                            Moderate
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.noise_level === "lively"}
                                                onChange={() => setNoiseFilter("lively")}
                                            />
                                            Lively
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Amenities</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.wifi}
                                                onChange={() => toggleBooleanFilter("wifi")}
                                            />
                                            WiFi
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.laptop_friendly}
                                                onChange={() => toggleBooleanFilter("laptop_friendly")}
                                            />
                                            Laptop OK
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Power Outlets
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Food & Drinks
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Open Late
                                        </label>

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={filters.nyu_discount}
                                                onChange={() => toggleBooleanFilter("nyu_discount")}
                                            />
                                            NYU Discount
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Distance</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Within 0.5 mi
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Within 1 mi
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Within 2 mi
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Within 5 mi
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-2">
                                    <button
                                        onClick={clearFilters}
                                        className="w-1/2 cursor-pointer rounded-full border border-white/10 px-4 py-3 font-medium text-white/70 hover:bg-white/5"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="w-1/2 cursor-pointer rounded-full bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </>
                        )}
                    </aside>

                    <div className="min-w-0 flex-1">
                        <Section
                            title="Featured Spots"
                            spaces={visibleSpaces}
                            loading={loading}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                        />
                        <Section title="Popular This Week" spaces={[]} loading={false} hide />
                        <Section
                            title="NYU Spaces"
                            spaces={visibleSpaces.filter((s) => s.nyu_discount)}
                            loading={loading}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                        />
                    </div>
                </div>
            </div>

            <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">
                    <Link href="/discover" className="flex flex-col items-center gap-1 text-purple-400">
                        <House size={20} />
                        <span>discover</span>
                    </Link>

                    <Link href="/map" className="flex flex-col items-center gap-1 hover:text-white">
                        <Map size={20} />
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
