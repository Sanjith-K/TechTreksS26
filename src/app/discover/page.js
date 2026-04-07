"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    GraduationCap,
    Heart,
    House,
    Map,
    SlidersHorizontal,
    User,
} from "lucide-react";
import Stars from "../../components/Stars";
import AuthButton from "../../components/AuthButton";
import SpaceCard from "../../components/SpaceCard";

const PRICE_MAP = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };
const CATEGORY_OPTIONS = [
    { id: "all", label: "All" },
    { id: "cafe", label: "Cafes" },
    { id: "library", label: "Libraries" },
    { id: "coworking", label: "Coworking" },
    { id: "lounge", label: "Lounges" },
];
const NOISE_OPTIONS = ["quiet", "moderate", "lively"];
const SORT_OPTIONS = [
    { value: "recommended", label: "Recommended" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "price-asc", label: "Price Low-High" },
    { value: "price-desc", label: "Price High-Low" },
    { value: "discount-first", label: "NYU Discount First" },
];
const AMENITY_OPTIONS = [
    { id: "wifi", label: "WiFi" },
    { id: "laptopFriendly", label: "Laptop OK" },
    { id: "bathroom", label: "Bathroom" },
    { id: "nyuDiscount", label: "NYU Discount" },
];

function parseTags(tags) {
    if (!tags) return [];

    if (Array.isArray(tags)) {
        return tags.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (typeof tags === "string") {
        try {
            const parsed = JSON.parse(tags);
            return Array.isArray(parsed)
                ? parsed.map((tag) => String(tag).trim()).filter(Boolean)
                : [];
        } catch {
            return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
        }
    }

    return [];
}

function normalizeText(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function inferCategories(name, tags, vibe, address) {
    const blob = [name, vibe, address, ...tags].map(normalizeText).join(" ");
    const categories = [];

    if (/(cafe|coffee|espresso|tea|boba|bakery)/.test(blob)) {
        categories.push("cafe");
    }
    if (/(library|bobst|reading room|study room)/.test(blob)) {
        categories.push("library");
    }
    if (/(cowork|co-work|workspace|shared office)/.test(blob)) {
        categories.push("coworking");
    }
    if (/(lounge|student center|commons|hangout|club)/.test(blob)) {
        categories.push("lounge");
    }

    return categories;
}

function mapSpace(space) {
    const tags = parseTags(space.tags);
    const categories = inferCategories(
        space.name,
        tags,
        space.vibe || space.noise_level,
        space.address
    );

    return {
        id: space.google_place_id,
        name: space.name,
        address: space.address || "",
        rating: space.rating || "—",
        price: PRICE_MAP[space.price_range] || "—",
        priceLevel: Number.isFinite(space.price_range) ? space.price_range : null,
        vibe: space.vibe || space.noise_level || "—",
        noiseLevel: normalizeText(space.noise_level || space.vibe),
        distance: "—",
        tags,
        nyu_discount: !!space.nyu_discount,
        wifi: !!space.wifi,
        bathroom: !!space.bathroom,
        laptopFriendly: !!space.laptop_friendly,
        categories,
    };
}

function sortSpaces(spaces, sortBy) {
    const cloned = [...spaces];

    cloned.sort((left, right) => {
        const nameCompare = left.name.localeCompare(right.name);
        const leftPrice = left.priceLevel ?? Number.POSITIVE_INFINITY;
        const rightPrice = right.priceLevel ?? Number.POSITIVE_INFINITY;

        if (sortBy === "name-asc") {
            return nameCompare;
        }

        if (sortBy === "price-asc") {
            return leftPrice - rightPrice || nameCompare;
        }

        if (sortBy === "price-desc") {
            return rightPrice - leftPrice || nameCompare;
        }

        if (sortBy === "discount-first") {
            return Number(right.nyu_discount) - Number(left.nyu_discount) || nameCompare;
        }

        return (
            Number(right.nyu_discount) - Number(left.nyu_discount) ||
            Number(right.wifi) - Number(left.wifi) ||
            leftPrice - rightPrice ||
            nameCompare
        );
    });

    return cloned;
}

function Section({ title, spaces, loading, subtitle }) {
    if (loading) {
        return (
            <section className="mt-8">
                <h2 className="mb-2 text-3xl font-semibold text-white">{title}</h2>
                {subtitle ? <p className="mb-4 text-white/50">{subtitle}</p> : null}
                <p className="text-white/50">Loading...</p>
            </section>
        );
    }

    return (
        <section className="mt-8">
            <h2 className="mb-2 text-3xl font-semibold text-white">{title}</h2>
            {subtitle ? <p className="mb-4 text-white/50">{subtitle}</p> : null}
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
                            />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

function FilterChip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                active
                    ? "rounded-full bg-blue-600 px-4 py-2 text-sm text-white"
                    : "rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 hover:bg-white/12"
            }
        >
            {children}
        </button>
    );
}

export default function DiscoverPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [showExtraPanel, setShowExtraPanel] = useState(false);
    const [allSpaces, setAllSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("recommended");
    const [maxPriceLevel, setMaxPriceLevel] = useState(4);
    const [budgetOnly, setBudgetOnly] = useState(false);
    const [selectedNoiseLevels, setSelectedNoiseLevels] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState({
        wifi: false,
        laptopFriendly: false,
        bathroom: false,
        nyuDiscount: false,
    });
    const [selectedPriceLevels, setSelectedPriceLevels] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces/`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setAllSpaces(Array.isArray(data) ? data.map(mapSpace) : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch spaces:", err);
                setLoading(false);
            });
    }, []);

    const toggleNoiseLevel = (level) => {
        setSelectedNoiseLevels((current) =>
            current.includes(level)
                ? current.filter((entry) => entry !== level)
                : [...current, level]
        );
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities((current) => ({
            ...current,
            [amenity]: !current[amenity],
        }));
    };

    const togglePriceLevel = (level) => {
        setSelectedPriceLevels((current) =>
            current.includes(level)
                ? current.filter((entry) => entry !== level)
                : [...current, level]
        );
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSortBy("recommended");
        setMaxPriceLevel(4);
        setBudgetOnly(false);
        setSelectedNoiseLevels([]);
        setSelectedAmenities({
            wifi: false,
            laptopFriendly: false,
            bathroom: false,
            nyuDiscount: false,
        });
        setSelectedPriceLevels([]);
    };

    const visibleSpaces = useMemo(() => {
        const normalizedQuery = normalizeText(searchQuery);

        const filtered = allSpaces.filter((space) => {
            if (normalizedQuery) {
                const searchBlob = [
                    space.name,
                    space.address,
                    space.vibe,
                    ...space.tags,
                    ...space.categories,
                ]
                    .map(normalizeText)
                    .join(" ");

                if (!searchBlob.includes(normalizedQuery)) {
                    return false;
                }
            }

            if (selectedCategory !== "all" && !space.categories.includes(selectedCategory)) {
                return false;
            }

            if (selectedNoiseLevels.length > 0 && !selectedNoiseLevels.includes(space.noiseLevel)) {
                return false;
            }

            if (selectedAmenities.wifi && !space.wifi) {
                return false;
            }

            if (selectedAmenities.laptopFriendly && !space.laptopFriendly) {
                return false;
            }

            if (selectedAmenities.bathroom && !space.bathroom) {
                return false;
            }

            if (selectedAmenities.nyuDiscount && !space.nyu_discount) {
                return false;
            }

            if (budgetOnly && (space.priceLevel === null || space.priceLevel > 2)) {
                return false;
            }

            if (maxPriceLevel < 4 && (space.priceLevel === null || space.priceLevel > maxPriceLevel)) {
                return false;
            }

            if (selectedPriceLevels.length > 0 && !selectedPriceLevels.includes(space.priceLevel)) {
                return false;
            }

            if (selectedPriceLevels.length > 0 && space.priceLevel === null) {
                return false;
            }

            return true;
        });

        return sortSpaces(filtered, sortBy);
    }, [
        allSpaces,
        budgetOnly,
        maxPriceLevel,
        searchQuery,
        selectedAmenities,
        selectedCategory,
        selectedNoiseLevels,
        selectedPriceLevels,
        sortBy,
    ]);

    const nyuSpaces = useMemo(
        () => visibleSpaces.filter((space) => space.nyu_discount),
        [visibleSpaces]
    );

    const hasActiveFilters = Boolean(
        searchQuery.trim() ||
        selectedCategory !== "all" ||
        budgetOnly ||
        maxPriceLevel < 4 ||
        selectedNoiseLevels.length > 0 ||
        selectedPriceLevels.length > 0 ||
        Object.values(selectedAmenities).some(Boolean)
    );

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#07152b] text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            <Stars />

            <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-8 pb-28 pt-6">
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
                        <AuthButton />

                        <button
                            type="button"
                            onClick={() => setShowFilters((current) => !current)}
                            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </header>

                <div className="mt-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search cafes, libraries, spaces..."
                            className="w-full rounded-full border border-white/8 bg-white/8 px-5 py-4 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35"
                        />

                        <label className="flex min-w-[220px] items-center gap-3 rounded-full border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/80 backdrop-blur-md">
                            <span className="whitespace-nowrap">Sort by</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-transparent text-white outline-none"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        className="bg-[#07152b]"
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-white/60">
                        <p>Near NYU Washington Square</p>
                        <p>{loading ? "Loading..." : `${visibleSpaces.length} spaces found`}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map((category) => (
                            <FilterChip
                                key={category.id}
                                active={selectedCategory === category.id}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.label}
                            </FilterChip>
                        ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <FilterChip
                            active={selectedAmenities.wifi}
                            onClick={() => toggleAmenity("wifi")}
                        >
                            WiFi
                        </FilterChip>
                        <FilterChip
                            active={selectedNoiseLevels.includes("quiet")}
                            onClick={() => toggleNoiseLevel("quiet")}
                        >
                            Quiet
                        </FilterChip>
                        <FilterChip
                            active={budgetOnly}
                            onClick={() => setBudgetOnly((current) => !current)}
                        >
                            Budget
                        </FilterChip>
                        <FilterChip
                            active={selectedAmenities.nyuDiscount}
                            onClick={() => toggleAmenity("nyuDiscount")}
                        >
                            NYU Discount
                        </FilterChip>
                        <FilterChip
                            active={selectedAmenities.laptopFriendly}
                            onClick={() => toggleAmenity("laptopFriendly")}
                        >
                            Laptop OK
                        </FilterChip>
                        <FilterChip
                            active={selectedAmenities.bathroom}
                            onClick={() => toggleAmenity("bathroom")}
                        >
                            Bathroom
                        </FilterChip>
                        <FilterChip
                            active={showExtraPanel || selectedNoiseLevels.length > 0 || selectedPriceLevels.length > 0}
                            onClick={() => setShowExtraPanel(true)}
                        >
                            More Filters
                        </FilterChip>
                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm text-red-200 hover:bg-red-500/15"
                            >
                                Clear All
                            </button>
                        ) : null}
                    </div>

                    {showExtraPanel && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-full max-w-3xl rounded-2xl border border-white/8 bg-[#0f1b33]/85 p-6 shadow-[0_0_40px_rgba(59,130,246,0.18)] backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">More Filters</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowExtraPanel(false)}
                                        className="text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Noise Level</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {NOISE_OPTIONS.map((level) => (
                                            <FilterChip
                                                key={level}
                                                active={selectedNoiseLevels.includes(level)}
                                                onClick={() => toggleNoiseLevel(level)}
                                            >
                                                {level[0].toUpperCase() + level.slice(1)}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Features</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {AMENITY_OPTIONS.map((option) => (
                                            <FilterChip
                                                key={option.id}
                                                active={selectedAmenities[option.id]}
                                                onClick={() => toggleAmenity(option.id)}
                                            >
                                                {option.label}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Exact Price Tiers</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {[1, 2, 3, 4].map((level) => (
                                            <FilterChip
                                                key={level}
                                                active={selectedPriceLevels.includes(level)}
                                                onClick={() => togglePriceLevel(level)}
                                            >
                                                {PRICE_MAP[level]}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowExtraPanel(false)}
                                        className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
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
                        className={`shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-white/8 backdrop-blur-md transition-all duration-300 ${
                            showFilters ? "w-[280px] p-5 opacity-100" : "w-0 border-transparent p-0 opacity-0"
                        }`}
                    >
                        {showFilters ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-semibold">Filters</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-white/85">Max Price</h3>
                                        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-300">
                                            {PRICE_MAP[maxPriceLevel]}
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min="1"
                                        max="4"
                                        step="1"
                                        value={maxPriceLevel}
                                        onChange={(e) => setMaxPriceLevel(Number(e.target.value))}
                                        className="mt-4 w-full accent-blue-500"
                                    />

                                    <div className="mt-2 flex justify-between text-sm text-white/60">
                                        <span>$</span>
                                        <span>{PRICE_MAP[maxPriceLevel]}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Noise Level</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        {NOISE_OPTIONS.map((level) => (
                                            <label key={level} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNoiseLevels.includes(level)}
                                                    onChange={() => toggleNoiseLevel(level)}
                                                />
                                                {level[0].toUpperCase() + level.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Amenities</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        {AMENITY_OPTIONS.map((option) => (
                                            <label key={option.id} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAmenities[option.id]}
                                                    onChange={() => toggleAmenity(option.id)}
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Exact Price Tiers</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        {[1, 2, 3, 4].map((level) => (
                                            <label key={level} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPriceLevels.includes(level)}
                                                    onChange={() => togglePriceLevel(level)}
                                                />
                                                {PRICE_MAP[level]}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="w-full rounded-full bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </aside>

                    <div className="min-w-0 flex-1">
                        <Section
                            title={hasActiveFilters ? "Results" : "Featured Spots"}
                            subtitle={
                                hasActiveFilters
                                    ? "Search, category, filter, and sort controls are applied to this list."
                                    : "Browse the current study-space listings."
                            }
                            spaces={visibleSpaces}
                            loading={loading}
                        />
                        <Section
                            title="NYU Spaces"
                            subtitle="Filtered down to the spots that advertise an NYU discount."
                            spaces={nyuSpaces}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            <nav className="relative z-10 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
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
