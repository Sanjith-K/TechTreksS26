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
    Users,
    MapPin,
    Sparkles,
    Tag,
} from "lucide-react";

const studentFavorites = [
    {
        id: 1,
        name: "Bobst Library",
        address: "70 Washington Square S",
        rating: 4.6,
        price: "$",
        vibe: "Quiet",
        distance: "0.2 mi",
        tags: ["Deep Focus", "Late Night"],
    },
    {
        id: 2,
        name: "Kimmel Student Center",
        address: "60 Washington Sq S",
        rating: 4.3,
        price: "$",
        vibe: "Lively",
        distance: "0.1 mi",
        tags: ["Group Work", "Quick Stop"],
    },
    {
        id: 3,
        name: "Think Coffee",
        address: "248 Mercer St",
        rating: 4.4,
        price: "$$",
        vibe: "Moderate",
        distance: "0.3 mi",
        tags: ["Coffee Break", "Study Session"],
    },
];

const nearCampus = [
    {
        id: 4,
        name: "Joe Coffee Company",
        address: "13 E 13th St",
        rating: 4.2,
        price: "$$",
        vibe: "Cozy",
        distance: "0.4 mi",
        tags: ["Solo Work", "Reading"],
    },
    {
        id: 5,
        name: "Stumptown Coffee",
        address: "30 W 8th St",
        rating: 4.4,
        price: "$$$",
        vibe: "Moderate",
        distance: "0.3 mi",
        tags: ["Morning Study", "Quick Work"],
    },
];

const onCampus = [
    {
        id: 6,
        name: "NYU Torch Club",
        address: "18 Waverly Pl",
        rating: 4.1,
        price: "$",
        vibe: "Quiet",
        distance: "0.2 mi",
        tags: ["Campus Spot", "Reading"],
    },
    {
        id: 7,
        name: "Third North Lounge",
        address: "75 3rd Ave",
        rating: 4.0,
        price: "$",
        vibe: "Casual",
        distance: "0.6 mi",
        tags: ["Hangout", "Study Break"],
    },
];

const discountSpots = [
    {
        id: 8,
        name: "The Uncommons",
        address: "230 Thompson St",
        rating: 4.5,
        price: "$$",
        vibe: "Social",
        distance: "0.4 mi",
        tags: ["NYU Discount", "Game Night"],
    },
    {
        id: 9,
        name: "Campus Coffee Corner",
        address: "Near Washington Square",
        rating: 4.1,
        price: "$",
        vibe: "Casual",
        distance: "0.2 mi",
        tags: ["Budget", "NYU Friendly"],
    },
];

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

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {spaces.map((space) => (
                    <Link key={space.id} href="/stores" className="block">
                        <SpaceCard {...space} />
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function NYUPage() {
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

                    {/* Quick chips */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        <button className="rounded-full bg-violet-600 px-4 py-2 text-sm text-white">
                            Student Favorites
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Near Bobst
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Open Late
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Group Study
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            Quiet Corners
                        </button>
                        <button className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                            NYU Discounts
                        </button>
                    </div>
                </section>

                {/* Sections */}
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
