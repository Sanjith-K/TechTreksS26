"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthButton from "../../components/AuthButton";
import SpaceCard from "../../components/SpaceCard";
import Stars from "../../components/Stars";
import { useAuth } from "../../context/AuthContext";
import { getSpaces } from "@/lib/spaces";
import {
    House,
    Map,
    GraduationCap,
    Heart,
    User,
    ArrowLeft,
    Users,
    MapPin,
    Sparkles,
    Tag,
} from "lucide-react";

const PRICE_MAP = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

function mapSpace(s) {
    let tags = [];
    if (typeof s.tags === "string" && s.tags) {
        try {
            tags = JSON.parse(s.tags);
        } catch {
            tags = s.tags.split(",").map((t) => t.trim()).filter(Boolean);
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

function Section({ title, subtitle, icon, spaces }) {
    return (
        <section className="mt-10">
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-white/8 p-2 text-white/80">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-white">{title}</h2>
                    {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
                </div>
            </div>

            {spaces.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/8 p-5 text-white/60 backdrop-blur-md">
                    No spots available in this section yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {spaces.map((space) => (
                        <Link key={space.id} href={`/stores/${space.id}`} className="block">
                            <SpaceCard {...space} />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function NYUPage() {
    const { user, isSignedIn, isNYU } = useAuth();
    const searchParams = useSearchParams();

    const backTo = searchParams.get("from") || "/discover";

    const [allSpaces, setAllSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSpaces() {
            if (!isSignedIn || !isNYU) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getSpaces();
                const mapped = Array.isArray(data) ? data.map(mapSpace) : [];
                setAllSpaces(mapped);
            } catch (err) {
                console.error(err);
                setError("Could not load NYU spaces.");
            } finally {
                setLoading(false);
            }
        }

        fetchSpaces();
    }, [isSignedIn, isNYU]);

    const { studentFavorites, nearCampus, onCampus, discountSpots } = useMemo(() => {
        const studentFavorites = allSpaces.filter(
            (space) =>
                space.tags.some((tag) =>
                    ["deep focus", "late night", "group work", "study session", "campus spot"].includes(
                        tag.toLowerCase()
                    )
                )
        );

        const nearCampus = allSpaces.filter(
            (space) =>
                typeof space.address === "string" &&
                (
                    space.address.toLowerCase().includes("washington") ||
                    space.address.toLowerCase().includes("mercer") ||
                    space.address.toLowerCase().includes("waverly") ||
                    space.address.toLowerCase().includes("thompson") ||
                    space.address.toLowerCase().includes("broadway")
                )
        );

        const onCampus = allSpaces.filter(
            (space) =>
                typeof space.name === "string" &&
                (
                    space.name.toLowerCase().includes("nyu") ||
                    space.name.toLowerCase().includes("bobst") ||
                    space.name.toLowerCase().includes("kimmel")
                )
        );

        const discountSpots = allSpaces.filter((space) => space.nyu_discount);

        return {
            studentFavorites,
            nearCampus,
            onCampus,
            discountSpots,
        };
    }, [allSpaces]);

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#07152b] text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            <Stars />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pb-36 pt-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-end gap-1">
                        <h1 className="font-[Be1Logo5] text-5xl tracking-wide sm:text-6xl">
                            Be1
                        </h1>
                        <span className="font-[Be1Logo5] text-2xl tracking-wide text-white/70 sm:text-3xl">
                            space
                        </span>
                    </div>

                    <AuthButton />
                </header>

                {/* Back */}
                <div className="mt-6 flex items-center gap-2 text-sm text-white/70 hover:text-white">
                    <Link href={backTo} className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                {/* Main content */}
                {!isSignedIn ? (
                    <section className="mt-6 rounded-3xl border border-white/8 bg-white/8 p-8 text-center backdrop-blur-md">
                        <div className="mx-auto flex w-fit rounded-full bg-violet-500/20 p-3 text-violet-300">
                            <GraduationCap size={24} />
                        </div>

                        <h1 className="mt-5 text-4xl font-semibold">Sign in to access NYU spaces</h1>
                        <p className="mt-3 text-white/60">
                            This section is only available for signed-in NYU users.
                        </p>

                        <Link
                            href={`/signin?redirect=/nyu&from=${encodeURIComponent(backTo)}`}
                            className="mt-6 inline-block rounded-full bg-violet-600 px-6 py-3 text-white hover:bg-violet-500"
                        >
                            Sign in
                        </Link>
                    </section>
                ) : !isNYU ? (
                    <section className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-md">
                        <div className="mx-auto flex w-fit rounded-full bg-red-500/15 p-3 text-red-300">
                            <GraduationCap size={24} />
                        </div>

                        <h1 className="mt-5 text-4xl font-semibold">NYU access only</h1>
                        <p className="mt-3 text-white/70">
                            This section is only available to users who signed up with an
                            <span className="mx-1 font-semibold text-white">@nyu.edu</span>
                            email.
                        </p>

                        <p className="mt-2 text-sm text-white/50">
                            Signed in as: {user?.email || "Unknown email"}
                        </p>
                    </section>
                ) : (
                    <>
                        {/* Header card */}
                        <section className="mt-6 rounded-3xl border border-white/8 bg-white/8 p-6 backdrop-blur-md">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-violet-500/20 p-3 text-violet-300">
                                    <GraduationCap size={24} />
                                </div>

                                <div>
                                    <h1 className="text-4xl font-semibold">NYU Community</h1>
                                    <p className="mt-2 max-w-2xl text-white/55">
                                        Spots NYU students actually use — curated around campus life,
                                        study habits, late-night sessions, and favorite places to meet,
                                        focus, and recharge.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {loading ? (
                            <div className="mt-10 rounded-2xl border border-white/8 bg-white/8 p-5 text-white/60 backdrop-blur-md">
                                Loading NYU spaces...
                            </div>
                        ) : error ? (
                            <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300 backdrop-blur-md">
                                {error}
                            </div>
                        ) : (
                            <>
                                <Section
                                    title="Student Favorites"
                                    subtitle="Most loved by NYU students"
                                    icon={<Users size={18} />}
                                    spaces={studentFavorites}
                                />

                                <Section
                                    title="Best Near Campus"
                                    subtitle="Easy stops between classes"
                                    icon={<MapPin size={18} />}
                                    spaces={nearCampus}
                                />

                                <Section
                                    title="On-Campus Spots"
                                    subtitle="Reliable campus study spaces"
                                    icon={<Sparkles size={18} />}
                                    spaces={onCampus}
                                />

                                <Section
                                    title="NYU Discount Spots"
                                    subtitle="Places with student-friendly perks"
                                    icon={<Tag size={18} />}
                                    spaces={discountSpots}
                                />
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Bottom Nav */}
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

                    <Link href="/nyu" className="flex flex-col items-center gap-1 text-purple-400">
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