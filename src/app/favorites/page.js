"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SpaceCard from "../../components/SpaceCard";
import Stars from "../../components/Stars";
import { getFavorites, removeFavorite } from "@/lib/favorites";
import {
    House,
    Map,
    GraduationCap,
    Heart,
    User,
    ArrowLeft,
} from "lucide-react";

const PRICE_MAP = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

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

function mapFavorite(item) {
    const s = item.Spaces || {};

    return {
        id: s.google_place_id,
        name: s.name || "Unknown Space",
        address: s.address || "",
        rating: "—",
        price: PRICE_MAP[s.price_range] || "$",
        vibe: s.vibe || s.noise_level || "—",
        distance: "—",
        tags: parseTags(s.tags),
    };
}

export default function FavoritesPage() {
    const [user, setUser] = useState(null);
    const [savedSpaces, setSavedSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isSignedIn = !!user?.id;

    useEffect(() => {
        try {
            const storedUser =
                typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("user"))
                    : null;

            setUser(storedUser);
        } catch (err) {
            console.error("Could not read signed-in user:", err);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        async function fetchFavorites() {
            if (!isSignedIn || !user?.id) {
                setSavedSpaces([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getFavorites(user.id);
                const mapped = Array.isArray(data) ? data.map(mapFavorite) : [];
                setSavedSpaces(mapped);
            } catch (err) {
                console.error(err);
                setError("Could not load favorites.");
            } finally {
                setLoading(false);
            }
        }

        fetchFavorites();
    }, [isSignedIn, user]);

    async function handleRemoveFavorite(spaceId) {
        try {
            if (!user?.id) return;

            await removeFavorite(user.id, spaceId);
            setSavedSpaces((prev) => prev.filter((space) => space.id !== spaceId));
        } catch (err) {
            console.error("Could not remove favorite:", err);
        }
    }

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#07152b] text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            {/* Stars */}
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

                </header>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/70 hover:text-white">
                    <Link href="/discover" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                <div className="mt-6">
                    <h1 className="text-5xl font-semibold">Favorites</h1>

                    {!isSignedIn ? (
                        <p className="mt-2 text-white/55">Sign in to view your saved places.</p>
                    ) : loading ? (
                        <p className="mt-2 text-white/55">Loading your saved places...</p>
                    ) : (
                        <p className="mt-2 text-white/55">{savedSpaces.length} saved places</p>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {!isSignedIn ? (
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-6 text-white/70 backdrop-blur-md">
                            Please sign in to view your favorites.
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300 backdrop-blur-md">
                            {error}
                        </div>
                    ) : loading ? (
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-6 text-white/70 backdrop-blur-md">
                            Loading...
                        </div>
                    ) : savedSpaces.length === 0 ? (
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-6 text-white/70 backdrop-blur-md">
                            No saved places yet.
                        </div>
                    ) : (
                        savedSpaces.map((space) => (
                            <Link key={space.id} href={`/stores/${space.id}`} className="block">
                                <SpaceCard
                                    {...space}
                                    isFavorited={true}
                                    onToggleFavorite={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRemoveFavorite(space.id);
                                    }}
                                />
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
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

                    <Link href="/favorites" className="flex flex-col items-center gap-1 text-purple-400">
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
