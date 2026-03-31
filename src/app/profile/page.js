"use client";

import Link from "next/link";
import SpaceCard from "../../components/SpaceCard";
import StarField from "../../components/StarField";
import {
    House,
    Map,
    GraduationCap,
    Heart,
    User,
    ArrowLeft,
    Bell,
    Shield,
    SlidersHorizontal,
    CircleHelp,
    LogOut,
    Pencil,
} from "lucide-react";

const favoriteSpaces = [
    {
        id: 1,
        name: "Bobst Library",
        address: "70 Washington Square S",
        rating: 4.5,
        price: "$",
        vibe: "Quiet",
        distance: "0.2 mi",
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
        tags: ["Group Study", "Coffee Break"],
    },
    {
        id: 3,
        name: "Stumptown Coffee",
        address: "30 W 8th St",
        rating: 4.4,
        price: "$$$",
        vibe: "Moderate",
        distance: "0.3 mi",
        tags: ["Morning Study", "Quick Work"],
    },
];

export default function ProfilePage() {
    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#07152b] text-white">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            {/* Stars */}
            <StarField />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-8 pb-28 pt-6">
                {/* Top header with logo */}
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

                {/* Back */}
                <div className="mt-6 flex items-center gap-2 text-sm text-white/70 hover:text-white">
                    <Link href="/discover" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                {/* Profile header */}
                <section className="mt-6 overflow-hidden rounded-3xl border border-white/8 bg-white/8 backdrop-blur-md">
                    <div className="rounded-b-3xl bg-[#0c1b37] px-6 py-8">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-3xl font-semibold">
                                    Z
                                </div>

                                <button className="absolute bottom-0 right-0 rounded-full bg-fuchsia-600 p-2 text-white shadow-md hover:bg-fuchsia-500">
                                    <Pencil size={14} />
                                </button>
                            </div>

                            <h1 className="mt-4 text-3xl font-semibold">NYU Student</h1>
                            <p className="mt-1 text-white/55">New York University</p>

                            <div className="mt-6 flex gap-10 text-center">
                                <div>
                                    <p className="text-2xl font-semibold">234</p>
                                    <p className="text-sm text-white/45">Followers</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">189</p>
                                    <p className="text-sm text-white/45">Following</p>
                                </div>
                            </div>

                            <button className="mt-6 rounded-full bg-fuchsia-600 px-6 py-2 text-sm font-medium text-white hover:bg-fuchsia-500">
                                Follow
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-2xl bg-white/5 p-4 text-center">
                                <p className="text-2xl font-semibold">3</p>
                                <p className="mt-1 text-sm text-white/45">Favorites</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-4 text-center">
                                <p className="text-2xl font-semibold">3</p>
                                <p className="mt-1 text-sm text-white/45">Visited</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-4 text-center">
                                <p className="text-2xl font-semibold">12</p>
                                <p className="mt-1 text-sm text-white/45">Reviews</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Study stats */}
                <section className="mt-8">
                    <h2 className="mb-4 text-2xl font-semibold">Study Stats</h2>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-md">
                            <p className="text-3xl font-semibold">47</p>
                            <p className="mt-1 text-sm text-white/45">Study Sessions</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-md">
                            <p className="text-3xl font-semibold">124</p>
                            <p className="mt-1 text-sm text-white/45">Hours Logged</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-md">
                            <p className="text-3xl font-semibold">23</p>
                            <p className="mt-1 text-sm text-white/45">Places Visited</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-md">
                            <p className="text-3xl font-semibold">12</p>
                            <p className="mt-1 text-sm text-white/45">Reviews</p>
                        </div>
                    </div>
                </section>

                {/* Favorites / Recent */}
                <section className="mt-8">
                    <div className="mb-5 flex gap-3">
                        <button className="rounded-full bg-fuchsia-600 px-4 py-2 text-sm text-white">
                            Favorites
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/70">
                            Recent
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {favoriteSpaces.map((space) => (
                            <Link key={space.id} href="/stores" className="block">
                                <SpaceCard {...space} />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Settings */}
                <section className="mt-8">
                    <h2 className="mb-4 text-2xl font-semibold">Settings</h2>

                    <div className="space-y-3">
                        <button className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/8 p-4 text-left backdrop-blur-md hover:bg-white/10">
                            <div className="flex items-center gap-3">
                                <Bell size={18} className="text-white/70" />
                                <span>Notifications</span>
                            </div>
                            <span className="text-white/35">{">"}</span>
                        </button>

                        <button className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/8 p-4 text-left backdrop-blur-md hover:bg-white/10">
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-white/70" />
                                <span>Privacy & Security</span>
                            </div>
                            <span className="text-white/35">{">"}</span>
                        </button>

                        <button className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/8 p-4 text-left backdrop-blur-md hover:bg-white/10">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal size={18} className="text-white/70" />
                                <span>Preferences</span>
                            </div>
                            <span className="text-white/35">{">"}</span>
                        </button>

                        <button className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/8 p-4 text-left backdrop-blur-md hover:bg-white/10">
                            <div className="flex items-center gap-3">
                                <CircleHelp size={18} className="text-white/70" />
                                <span>Help & Support</span>
                            </div>
                            <span className="text-white/35">{">"}</span>
                        </button>

                        <button className="flex w-full items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left text-red-300 backdrop-blur-md hover:bg-red-500/10">
                            <div className="flex items-center gap-3">
                                <LogOut size={18} />
                                <span>Log Out</span>
                            </div>
                            <span className="text-red-300/60">{">"}</span>
                        </button>
                    </div>
                </section>

                {/* Footer text */}
                <div className="mt-10 text-center text-sm text-white/35">
                    <p>Be in1 v1.0.0</p>
                    <p className="mt-1">Made for NYU Students 💜</p>
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

                    <Link href="/profile" className="flex flex-col items-center gap-1 text-purple-400">
                        <User size={20} />
                        <span>profile</span>
                    </Link>
                </div>
            </nav>
        </main>
    );
}
