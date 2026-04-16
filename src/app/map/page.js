"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthButton from "../../components/AuthButton";
import {
    House,
    Map as MapIcon,
    GraduationCap,
    Heart,
    User,
    ArrowLeft,
    SlidersHorizontal,
    LocateFixed,
} from "lucide-react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function MapPage() {
    const [spaces, setSpaces] = useState([]);

    useEffect(() => {
        async function loadSpaces() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/spaces/map`
                );
                if (!res.ok) return;
                const data = await res.json();
                setSpaces(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        }
        loadSpaces();
    }, []);

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
                    const size = Math.random() * 2 + 1;
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

                {/* LOGO HEADER  */}
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
                    <Link href="/discover" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                {/* Header Card */}
                <section className="mt-6 rounded-3xl border border-white/8 bg-white/8 p-6 backdrop-blur-md">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold">Map</h1>
                            <p className="mt-2 text-white/55">
                                Explore study spots visually around NYU and nearby neighborhoods
                            </p>
                        </div>

                        <button className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 hover:bg-white/12">
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                        <input
                            type="text"
                            placeholder="Search places on the map..."
                            className="w-full rounded-full border border-white/8 bg-white/8 px-5 py-4 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35"
                        />

                        <button className="flex items-center justify-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-200 hover:bg-cyan-400/15">
                            <LocateFixed size={16} />
                            Use My Location
                        </button>
                    </div>
                </section>

                {/* Map */}
                <section className="mt-6 overflow-hidden rounded-3xl border border-white/8 bg-white/8 p-4 backdrop-blur-md">
                    <div className="h-[65vh] overflow-hidden rounded-2xl">
                        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                            <Map
                                defaultCenter={{ lat: 40.7291, lng: -73.9965 }}
                                defaultZoom={15}
                                style={{ width: "100%", height: "100%" }}
                                gestureHandling="greedy"
                            >
                                {spaces.map((space) => (
                                    <Marker
                                        key={space.google_place_id}
                                        position={{
                                            lat: space.latitude,
                                            lng: space.longitude,
                                        }}
                                        title={space.name}
                                    />
                                ))}
                            </Map>
                        </APIProvider>
                    </div>
                </section>
            </div>

            {/* Bottom Nav */}
            <nav className="relative z-10 border-t border-white/10 bg-[#0e1a31]/90 px-6 py-5 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl justify-around text-sm text-white/55">
                    <Link href="/discover" className="flex flex-col items-center gap-1 hover:text-white">
                        <House size={20} />
                        <span>discover</span>
                    </Link>

                    <Link href="/map" className="flex flex-col items-center gap-1 text-purple-400">
                        <MapIcon size={20} />
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