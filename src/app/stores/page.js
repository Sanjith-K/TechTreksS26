"use client";

import Link from "next/link";
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

export default function StorePage() {
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
                        <button className="hover:text-white">...</button>
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
                            <h1 className="text-4xl font-semibold">The Uncommons</h1>

                            <div className="mt-2 flex items-center gap-2 text-white/60">
                                <MapPin size={14} />
                                <span className="text-sm">230 Thompson St</span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="rounded-full bg-purple-600/80 px-3 py-1 text-xs text-white">
                                    Hangout
                                </span>
                                <span className="rounded-full bg-purple-600/80 px-3 py-1 text-xs text-white">
                                    Game Night
                                </span>
                                <span className="rounded-full bg-purple-600/80 px-3 py-1 text-xs text-white">
                                    Social
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="rounded-full bg-white/10 p-2 hover:bg-white/15">
                                <Heart size={16} />
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
                            <p className="text-white/85">Affordable</p>
                            <p className="mt-1 text-sm text-white/50">$5-10 average</p>
                        </div>

                        <div className="flex gap-1 text-2xl font-semibold text-white/70">
                            <span>$</span>
                            <span>$</span>
                            <span>$</span>
                            <span className="opacity-30">$</span>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 px-4 py-3 text-sm text-fuchsia-200">
                        NYU Student Discount Available
                    </div>
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
                            <p className="font-medium">Lively & Social</p>
                        </div>

                        <p className="mt-2 text-sm text-orange-100/80">
                            Energetic atmosphere with conversations and activity. Ideal for
                            socializing and group work.
                        </p>

                        <div className="mt-5">
                            <div className="flex items-center justify-between text-xs text-orange-100/70">
                                <span>Noise Level</span>
                                <span>Lively</span>
                            </div>

                            <div className="mt-2 h-2 rounded-full bg-orange-950/40">
                                <div className="h-2 w-[85%] rounded-full bg-orange-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold">About</h2>
                    <p className="mt-4 text-white/75">
                        Board game cafe perfect for unwinding after class. Hundreds of games
                        available and a great atmosphere.
                    </p>
                </section>

                {/* Details */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold">Details</h2>

                    <div className="mt-4 grid gap-4 text-white/75 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock3 size={16} />
                                <span>11:00 AM - 11:00 PM</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Wifi size={16} />
                                <span>Free WiFi</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <PlugZap size={16} />
                                <span>Power Outlets Available</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Laptop size={16} />
                                <span>Laptop Friendly</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Bath size={16} />
                                <span>Bathroom Available</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mt-4 rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                    <h2 className="text-xl font-semibold">Features</h2>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {["WiFi", "Board Games", "Coffee", "Outlets"].map((feature) => (
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
