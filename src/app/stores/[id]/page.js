"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Share2,
    Heart,
    MapPin,
    Clock3,
    Wifi,
    PlugZap,
    Laptop,
    Bath,
    Music2,
    Phone,
    Navigation,
    DollarSign,
    Image as ImageIcon,
    House,
    Map,
    GraduationCap,
    User,
} from "lucide-react";

function parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;

    if (typeof tags === "string") {
        try {
            return JSON.parse(tags);
        } catch {
            return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
        }
    }

    return [];
}

function getPriceDisplay(priceRange) {
    const map = {
        1: "$",
        2: "$$",
        3: "$$$",
        4: "$$$$",
    };
    return map[priceRange] || "$";
}

export default function StorePage() {
    const params = useParams();
    const id = params?.id;

    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);
    const [isFavorited, setIsFavorited] = useState(false);

    async function handleToggleFavorite() {
        if (!user) return;
        try {
            if (isFavorited) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${user.id}/favorites/${id}`,
                    {
                        method: "DELETE",
                    }
                );
                setIsFavorited(false);
            } else {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${user.id}/favorites`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ space_id: id }),
                    }
                );
                setIsFavorited(true);
            }
        } catch (err) {
            console.error("Favorite update failed:", err);
        }
    }

    useEffect(() => {
        async function fetchSpace() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces/${id}`);

                if (!res.ok) {
                    throw new Error("Could not load this study spot.");
                }

                const data = await res.json();
                setSpace(data);
            } catch (err) {
                console.error(err);
                setError("Could not load this study spot.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchSpace();
        }
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#07152b] px-6 py-10 text-white">
                <p>Loading study spot...</p>
            </main>
        );
    }

    if (error || !space) {
        return (
            <main className="min-h-screen bg-[#07152b] px-6 py-10 text-white">
                <Link href="/discover" className="text-sm text-white/70 hover:text-white">
                    ← Back to Discover
                </Link>
                <p className="mt-6 text-red-300">{error || "Study spot not found."}</p>
            </main>
        );
    }

    const tags = parseTags(space.tags);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#07152b] text-white">
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
            <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-4">
                {/* Top bar */}
                <div className="flex items-center justify-between text-white/85">
                    <Link
                        href="/discover"
                        className="flex items-center gap-2 text-sm hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button className="hover:text-white">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Hero image placeholder */}
                <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/8">
                    <div className="flex h-[260px] items-center justify-center bg-gradient-to-br from-slate-500/30 to-slate-700/20 text-white/35">
                        <div className="flex flex-col items-center gap-2">
                            <ImageIcon size={42} />
                            <span className="text-sm">Main photo placeholder</span>
                        </div>
                    </div>
                </div>

                {/* Main info card */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-semibold">{space.name}</h1>

                            <div className="mt-2 flex items-center gap-2 text-white/60">
                                <MapPin size={14} />
                                <span className="text-sm">{space.address || "Address not listed"}</span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-purple-600/80 px-3 py-1 text-xs text-white"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="rounded-full bg-purple-600/80 px-3 py-1 text-xs text-white">
                                        Study Spot
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleToggleFavorite}
                                className={`rounded-full p-2 hover:bg-white/15 ${isFavorited ? "bg-red-500/30 text-red-400" : "bg-white/10"}`}
                            >
                                <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                            </button>
                            <span className="rounded-full bg-green-600/20 px-3 py-1 text-sm text-green-300">
                                Open
                            </span>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-white">
                        <div className="rounded-full bg-blue-500/20 p-2 text-blue-300">
                            <DollarSign size={16} />
                        </div>
                        <h2 className="text-xl font-semibold">Pricing</h2>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/85">Price Range</p>
                            <p className="mt-1 text-sm text-white/50">
                                {getPriceDisplay(space.price_range)}
                            </p>
                        </div>

                        <div className="text-2xl font-semibold text-white/70">
                            {getPriceDisplay(space.price_range)}
                        </div>
                    </div>

                    {space.nyu_discount && (
                        <div className="mt-5 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 px-4 py-3 text-sm text-fuchsia-200">
                            NYU Student Discount Available
                        </div>
                    )}
                </section>

                {/* Photos */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-white">
                        <div className="rounded-full bg-pink-500/20 p-2 text-pink-300">
                            <ImageIcon size={16} />
                        </div>
                        <h2 className="text-xl font-semibold">Photos</h2>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex h-44 items-center justify-center rounded-2xl border border-white/8 bg-white/8 text-white/35"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <ImageIcon size={28} />
                                    <span className="text-xs">Photo {item}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vibe */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-white">
                        <div className="rounded-full bg-orange-500/20 p-2 text-orange-300">
                            <Music2 size={16} />
                        </div>
                        <h2 className="text-xl font-semibold">Vibe & Atmosphere</h2>
                    </div>

                    <div className="mt-4 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
                        <div className="flex items-center gap-2 text-orange-300">
                            <Music2 size={15} />
                            <p className="font-medium">{space.vibe || "Study-friendly"}</p>
                        </div>

                        <p className="mt-2 text-sm text-orange-100/80">
                            This space is great for students looking for a comfortable place to work or study.
                        </p>

                        <div className="mt-5">
                            <div className="flex items-center justify-between text-xs text-orange-100/70">
                                <span>Noise Level</span>
                                <span>{space.noise_level || "Unknown"}</span>
                            </div>

                            <div className="mt-2 h-2 rounded-full bg-orange-950/40">
                                <div className="h-2 w-[70%] rounded-full bg-orange-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold">About</h2>
                    <p className="mt-4 text-white/75">
                        {space.description || "A solid place to study, hang out, and get work done near campus."}
                    </p>
                </section>

                {/* Details */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold">Details</h2>

                    <div className="mt-4 grid gap-4 text-white/75 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock3 size={16} />
                                <span>Hours not listed yet</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Wifi size={16} />
                                <span>WiFi availability not listed</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <PlugZap size={16} />
                                <span>Outlet availability not listed</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Laptop size={16} />
                                <span>Laptop Friendly</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Bath size={16} />
                                <span>Bathroom info not listed</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold">Features</h2>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(tags.length > 0 ? tags : ["Study Spot", "WiFi", "Coffee"]).map((feature) => (
                            <span
                                key={feature}
                                className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm text-white/70"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Bottom buttons */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white/85 hover:bg-white/10">
                        <Phone size={16} />
                        <span>Call</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-500 px-4 py-4 font-medium text-white hover:opacity-90">
                        <Navigation size={16} />
                        <span>Directions</span>
                    </button>
                </div>
            </div>

            {/* Bottom Nav */}
            <nav className="relative z-10 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">
                    <Link href="/discover" className="flex flex-col items-center gap-1 hover:text-white">
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