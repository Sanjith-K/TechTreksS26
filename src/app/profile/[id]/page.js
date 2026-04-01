"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PublicProfilePage() {
    const params = useParams();
    const id = params?.id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}`);

                if (!res.ok) {
                    throw new Error("Could not load profile.");
                }

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                setError("Could not load profile.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) {
        return <main className="min-h-screen bg-[#07152b] p-8 text-white">Loading profile...</main>;
    }

    if (error || !profile) {
        return (
            <main className="min-h-screen bg-[#07152b] p-8 text-white">
                <Link href="/discover">← Back</Link>
                <p className="mt-4 text-red-300">{error || "Profile not found."}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#07152b] p-8 text-white">
            <Link href="/discover" className="text-sm text-white/70 hover:text-white">
                ← Back
            </Link>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-3xl font-semibold">
                    {(profile.name?.[0] || profile.email?.[0] || "U").toUpperCase()}
                </div>

                <h1 className="mt-4 text-3xl font-semibold">{profile.name || "User"}</h1>
                <p className="mt-2 text-white/60">{profile.email}</p>
            </section>
        </main>
    );
}