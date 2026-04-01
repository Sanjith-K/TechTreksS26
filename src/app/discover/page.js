"use client";

import { useState } from "react";
import Link from "next/link";
import SpaceCard from "../../components/SpaceCard";
import {
    House,
    Map,
    GraduationCap,
    Heart,
    User,
    SlidersHorizontal,
} from "lucide-react";

const featuredSpaces = [
    {
        id: 1,
        name: "Bobst Library",
        address: "70 Washington Square S",
        rating: 4.5,
        price: "$",
        vibe: "Quiet",
        distance: "0.2 mi",
        category: "Libraries",
        features: ["WiFi", "Quiet", "Laptop OK", "Open Now", "Open Late"],
        tags: ["Deep Focus", "All-nighter"],
    },
    {
        id: 2,
        name: "Think Coffee",
        address: "248 Mercer St",
        rating: 4.3,
        price: "$$",
        vibe: "Moderate",
        distance: "0.3 mi",
        category: "Cafes",
        features: ["WiFi", "Budget", "Open Now", "Laptop OK"],
        tags: ["Group Study", "Coffee Break"],
    },
];

const popularSpaces = [
    {
        id: 3,
        name: "Stumptown Coffee",
        address: "30 W 8th St",
        rating: 4.4,
        price: "$$$",
        vibe: "Moderate",
        distance: "0.3 mi",
        category: "Cafes",
        features: ["WiFi", "Laptop OK", "Open Now"],
        tags: ["Morning Study", "Quick Work"],
    },
    {
        id: 4,
        name: "Kimmel Student Center",
        address: "60 Washington Sq S",
        rating: 4.2,
        price: "$",
        vibe: "Lively",
        distance: "0.1 mi",
        category: "Lounges",
        features: ["WiFi", "Open Now", "Laptop OK"],
        tags: ["Student Space", "Quick Meetup"],
    },
];

const nyuSpaces = [
    {
        id: 5,
        name: "NYU Torch Club",
        address: "18 Waverly Pl",
        rating: 4.0,
        price: "$",
        vibe: "Quiet",
        distance: "0.2 mi",
        category: "Coworking",
        features: ["WiFi", "Quiet", "Open Now", "NYU Discount"],
        tags: ["Campus Spot", "Reading"],
    },
    {
        id: 6,
        name: "Kimmel Student Center",
        address: "60 Washington Sq S",
        rating: 4.2,
        price: "$",
        vibe: "Lively",
        distance: "0.1 mi",
        category: "Lounges",
        features: ["WiFi", "Open Now", "Laptop OK"],
        tags: ["Student Space", "Quick Meetup"],
    },
];

const allSpaces = [
    ...featuredSpaces.map((space) => ({ ...space, section: "Featured Spots" })),
    ...popularSpaces.map((space) => ({ ...space, section: "Popular This Week" })),
    ...nyuSpaces.map((space) => ({ ...space, section: "NYU Spaces" })),
];

const categoryOptions = ["All", "Cafes", "Libraries", "Coworking", "Lounges"];
const quickFeatureOptions = ["WiFi", "Quiet", "Budget", "Open Now", "NYU Discount", "Laptop OK"];
const vibeOptions = ["Quiet", "Moderate", "Lively"];
const extraFeatureOptions = ["WiFi", "Outlets", "Laptop OK", "Bathroom", "NYU Discount"];
const priceOptions = ["$", "$$", "$$$", "$$$$"];
const distanceOptions = [
    { label: "Within 0.5 mi", max: 0.5 },
    { label: "Within 1 mi", max: 1 },
    { label: "Within 2 mi", max: 2 },
    { label: "Within 5 mi", max: 5 },
];
const priceThresholds = {
    $: 25,
    $$: 50,
    $$$: 75,
    $$$$: 100,
};
const starField = Array.from({ length: 60 }, (_, index) => ({
    id: index,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
}));

function FilterChip({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full border px-4 py-2 text-sm transition ${active
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-white/10 bg-white/8 text-white/80 hover:bg-white/12"
                }`}
        >
            {children}
        </button>
    );
}

function Section({ title, spaces }) {
    if (spaces.length === 0) {
        return null;
    }

    return (
        <section className="mt-8">
            <h2 className="mb-4 text-3xl font-semibold text-white">{title}</h2>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {spaces.map((space) => (
                    <Link key={`${title}-${space.id}`} href="/stores" className="block">
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
        </section>
    );
}

function parseDistance(distance) {
    return Number.parseFloat(distance);
}

export default function DiscoverPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [showExtraPanel, setShowExtraPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedQuickFeatures, setSelectedQuickFeatures] = useState([]);
    const [priceValue, setPriceValue] = useState(100);
    const [selectedVibes, setSelectedVibes] = useState([]);
    const [selectedExtraFeatures, setSelectedExtraFeatures] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedDistances, setSelectedDistances] = useState([]);

    const toggleSelection = (value, selectedValues, setSelectedValues) => {
        setSelectedValues((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedQuickFeatures([]);
        setPriceValue(100);
        setSelectedVibes([]);
        setSelectedExtraFeatures([]);
        setSelectedPrices([]);
        setSelectedDistances([]);
    };

    const activeFeatureFilters = [...selectedQuickFeatures, ...selectedExtraFeatures];

    const filteredSpaces = allSpaces.filter((space) => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const matchesSearch =
            normalizedQuery.length === 0 ||
            [
                space.name,
                space.address,
                space.vibe,
                space.category,
                ...space.tags,
                ...space.features,
            ].some((value) => value.toLowerCase().includes(normalizedQuery));

        const matchesCategory =
            selectedCategory === "All" || space.category === selectedCategory;

        const matchesQuickFeatures = selectedQuickFeatures.every((feature) =>
            space.features.includes(feature)
        );

        const matchesExtraFeatures = selectedExtraFeatures.every((feature) =>
            space.features.includes(feature)
        );

        const matchesVibe =
            selectedVibes.length === 0 || selectedVibes.includes(space.vibe);

        const matchesPriceButtons =
            selectedPrices.length === 0 || selectedPrices.includes(space.price);

        const matchesPriceSlider = priceThresholds[space.price] <= priceValue;

        const spaceDistance = parseDistance(space.distance);
        const matchesDistance =
            selectedDistances.length === 0 ||
            selectedDistances.some((limit) => spaceDistance <= limit);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesQuickFeatures &&
            matchesExtraFeatures &&
            matchesVibe &&
            matchesPriceButtons &&
            matchesPriceSlider &&
            matchesDistance
        );
    });

    const filteredSections = [
        {
            title: "Featured Spots",
            spaces: filteredSpaces.filter((space) => space.section === "Featured Spots"),
        },
        {
            title: "Popular This Week",
            spaces: filteredSpaces.filter((space) => space.section === "Popular This Week"),
        },
        {
            title: "NYU Spaces",
            spaces: filteredSpaces.filter((space) => space.section === "NYU Spaces"),
        },
    ];

    const hasActiveFilters =
        searchQuery.trim().length > 0 ||
        selectedCategory !== "All" ||
        selectedQuickFeatures.length > 0 ||
        selectedVibes.length > 0 ||
        selectedExtraFeatures.length > 0 ||
        selectedPrices.length > 0 ||
        selectedDistances.length > 0 ||
        priceValue !== 100;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#07152b] text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            <div className="pointer-events-none absolute inset-0">
                {starField.map((star) => (
                    <span
                        key={star.id}
                        className="star"
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            animationDelay: `${star.delay}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-8 pb-28 pt-6">
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold">
                            Z
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </header>

                <div className="mt-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cafes, libraries, spaces..."
                        className="w-full rounded-full border border-white/8 bg-white/8 px-5 py-4 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35"
                    />

                    <p className="mt-3 text-white/60">Near NYU Washington Square</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {categoryOptions.map((category) => (
                            <FilterChip
                                key={category}
                                active={selectedCategory === category}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </FilterChip>
                        ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {quickFeatureOptions.map((feature) => (
                            <FilterChip
                                key={feature}
                                active={selectedQuickFeatures.includes(feature)}
                                onClick={() =>
                                    toggleSelection(
                                        feature,
                                        selectedQuickFeatures,
                                        setSelectedQuickFeatures
                                    )
                                }
                            >
                                {feature}
                            </FilterChip>
                        ))}
                        <FilterChip
                            active={showExtraPanel || selectedExtraFeatures.length > 0}
                            onClick={() => setShowExtraPanel(true)}
                        >
                            etc.
                        </FilterChip>
                    </div>

                    {showExtraPanel && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-full max-w-3xl rounded-2xl border border-white/8 bg-[#0f1b33]/85 p-6 shadow-[0_0_40px_rgba(59,130,246,0.18)] backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Filters</h3>
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
                                        {vibeOptions.map((item) => (
                                            <FilterChip
                                                key={item}
                                                active={selectedVibes.includes(item)}
                                                onClick={() =>
                                                    toggleSelection(
                                                        item,
                                                        selectedVibes,
                                                        setSelectedVibes
                                                    )
                                                }
                                            >
                                                {item}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Features</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {extraFeatureOptions.map((item) => (
                                            <FilterChip
                                                key={item}
                                                active={selectedExtraFeatures.includes(item)}
                                                onClick={() =>
                                                    toggleSelection(
                                                        item,
                                                        selectedExtraFeatures,
                                                        setSelectedExtraFeatures
                                                    )
                                                }
                                            >
                                                {item}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Price</h4>
                                    <div className="mt-2 flex gap-2">
                                        {priceOptions.map((price) => (
                                            <FilterChip
                                                key={price}
                                                active={selectedPrices.includes(price)}
                                                onClick={() =>
                                                    toggleSelection(
                                                        price,
                                                        selectedPrices,
                                                        setSelectedPrices
                                                    )
                                                }
                                            >
                                                {price}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Distance</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {distanceOptions.map((option) => (
                                            <FilterChip
                                                key={option.label}
                                                active={selectedDistances.includes(option.max)}
                                                onClick={() =>
                                                    toggleSelection(
                                                        option.max,
                                                        selectedDistances,
                                                        setSelectedDistances
                                                    )
                                                }
                                            >
                                                {option.label}
                                            </FilterChip>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowExtraPanel(false)}
                                        className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
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
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-white/85">
                                            Price Range
                                        </h3>
                                        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-300">
                                            ${priceValue}
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min="25"
                                        max="100"
                                        step="25"
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(Number(e.target.value))}
                                        className="mt-4 w-full accent-blue-500"
                                    />

                                    <div className="mt-2 flex justify-between text-sm text-white/60">
                                        <span>$</span>
                                        <span>${priceValue}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Vibe</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        {vibeOptions.map((vibe) => (
                                            <label key={vibe} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVibes.includes(vibe)}
                                                    onChange={() =>
                                                        toggleSelection(
                                                            vibe,
                                                            selectedVibes,
                                                            setSelectedVibes
                                                        )
                                                    }
                                                />
                                                {vibe}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">
                                        Amenities
                                    </h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        {quickFeatureOptions.map((feature) => (
                                            <label
                                                key={feature}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedQuickFeatures.includes(feature)}
                                                    onChange={() =>
                                                        toggleSelection(
                                                            feature,
                                                            selectedQuickFeatures,
                                                            setSelectedQuickFeatures
                                                        )
                                                    }
                                                />
                                                {feature}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Distance</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        {distanceOptions.map((option) => (
                                            <label
                                                key={option.label}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDistances.includes(option.max)}
                                                    onChange={() =>
                                                        toggleSelection(
                                                            option.max,
                                                            selectedDistances,
                                                            setSelectedDistances
                                                        )
                                                    }
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-8 w-full rounded-full bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700"
                                >
                                    Clear Filters
                                </button>
                            </>
                        )}
                    </aside>

                    <div className="min-w-0 flex-1">
                        <div className="rounded-2xl border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/70 backdrop-blur-md">
                            Showing {filteredSpaces.length} result
                            {filteredSpaces.length === 1 ? "" : "s"}
                            {hasActiveFilters ? " with filters applied" : ""}
                            {activeFeatureFilters.length > 0
                                ? ` • ${activeFeatureFilters.join(", ")}`
                                : ""}
                        </div>

                        {filteredSpaces.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-white/8 bg-white/8 px-6 py-10 text-center backdrop-blur-md">
                                <h2 className="text-2xl font-semibold text-white">
                                    No spaces match those filters
                                </h2>
                                <p className="mt-2 text-white/60">
                                    Try widening the price range or clearing a few filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            filteredSections.map((section) => (
                                <Section
                                    key={section.title}
                                    title={section.title}
                                    spaces={section.spaces}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <nav className="relative z-10 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">
                    <Link
                        href="/discover"
                        className="flex flex-col items-center gap-1 text-purple-400"
                    >
                        <House size={20} />
                        <span>discover</span>
                    </Link>

                    <Link
                        href="/map"
                        className="flex flex-col items-center gap-1 hover:text-white"
                    >
                        <Map size={20} />
                        <span>map</span>
                    </Link>

                    <Link
                        href="/nyu"
                        className="flex flex-col items-center gap-1 hover:text-white"
                    >
                        <GraduationCap size={20} />
                        <span>NYU</span>
                    </Link>

                    <Link
                        href="/favorites"
                        className="flex flex-col items-center gap-1 hover:text-white"
                    >
                        <Heart size={20} />
                        <span>favorites</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="flex flex-col items-center gap-1 hover:text-white"
                    >
                        <User size={20} />
                        <span>profile</span>
                    </Link>
                </div>
            </nav>
        </main>
    );
}
