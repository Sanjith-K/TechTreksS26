"use client";

import { useState, useEffect } from "react";
import AuthButton from "../../components/AuthButton";
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

const PRICE_MAP = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

function mapSpace(s) {
    let tags = [];
    if (typeof s.tags === "string" && s.tags) {
        try { tags = JSON.parse(s.tags); } catch { tags = s.tags.split(",").map((t) => t.trim()); }
    } else if (Array.isArray(s.tags)) {
        tags = s.tags;
    }
    return {
        id: s.google_place_id,
        name: s.name,
        address: s.address || "",
        rating: "—",
        price: PRICE_MAP[s.price_range] || "$",
        vibe: s.vibe || s.noise_level || "—",
        distance: "—",
        tags,
        nyu_discount: s.nyu_discount,
    };
}

function Section({ title, spaces, loading, hide }) {
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
    const [allSpaces, setAllSpaces] = useState([]);
    const [loading, setLoading] = useState(true);

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
    const [priceValue, setPriceValue] = useState(50);
    const [showExtraPanel, setShowExtraPanel] = useState(false);

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
                    const size = Math.random() * 2 + 1; // 1px–3px
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const delay = Math.random() * 3;

                    return (
                        <span
                            key={i}
                            className="star"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${left}%`,
                                top: `${top}%`,
                                animationDelay: `${delay}s`,
                            }}
                        />
                    );
                })}
            </div>
            {/* Content */}
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
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                </header>

                {/* Search */}
                <div className="mt-6">
                    <input
                        type="text"
                        placeholder="Search cafes, libraries, spaces..."
                        className="w-full rounded-full border border-white/8 bg-white/8 px-5 py-4 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35"
                    />

                    <p className="mt-3 text-white/60">Near NYU Washington Square</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white">
                            All
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Cafes
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Libraries
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Coworking
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Lounges
                        </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            WiFi
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Quiet
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Budget
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Open Now
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            NYU Discount
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Laptop OK
                        </button>
                        <button
                            onClick={() => setShowExtraPanel(true)}
                            className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 hover:bg-white/12"
                        >
                            etc.
                        </button>
                    </div>

                    {/* Extra pop-up filter panel */}
                    {showExtraPanel && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-full max-w-3xl rounded-2xl border border-white/8 bg-[#0f1b33]/85 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.18)]">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                                    <button
                                        onClick={() => setShowExtraPanel(false)}
                                        className="text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Noise Level</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {["Quiet", "Moderate", "Lively"].map((item) => (
                                            <button
                                                key={item}
                                                className="rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-sm text-white/80"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Features</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {["WiFi", "Outlets", "Laptop", "Bathroom", "NYU Discount"].map((item) => (
                                            <button
                                                key={item}
                                                className="rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-sm text-white/80"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <h4 className="text-sm text-white/70">Price</h4>
                                    <div className="mt-2 flex gap-2">
                                        {["$", "$$", "$$$", "$$$$"].map((p) => (
                                            <button
                                                key={p}
                                                className="rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-sm text-white/80"
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">
                                        Clear
                                    </button>
                                    <button className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main layout */}
                <div className="mt-8 flex gap-6">
                    {/* Sidebar */}
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
                                        className="text-white/60 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-white/85">Price Range</h3>
                                        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-300">
                                            ${priceValue}
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(e.target.value)}
                                        className="mt-4 w-full accent-blue-500"
                                    />

                                    <div className="mt-2 flex justify-between text-sm text-white/60">
                                        <span>$0</span>
                                        <span>${priceValue}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Vibe</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Quiet
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Moderate
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            Lively
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white/85">Amenities</h3>
                                    <div className="mt-3 space-y-3 text-white/80">
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
                                            WiFi
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" />
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

                                <button className="mt-8 w-full rounded-full bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700">
                                    Apply Filters
                                </button>
                            </>
                        )}
                    </aside>

                    {/* Sections */}
                    <div className="min-w-0 flex-1">
                        <Section title="Featured Spots" spaces={allSpaces} loading={loading} />
                        <Section title="Popular This Week" spaces={[]} loading={false} hide />
                        <Section title="NYU Spaces" spaces={allSpaces.filter((s) => s.nyu_discount)} loading={loading} />
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
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