"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Stars from "../../components/Stars";
import { login } from "@/lib/auth";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get("redirect") || "/discover";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login({ email, password });

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                const fallbackUser = { email };
                localStorage.setItem("user", JSON.stringify(fallbackUser));
            }

            router.push(redirectTo);
        } catch (err) {
            console.error("Sign in failed:", err);
            setError(err.message || "Could not sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#07152b] text-white">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            <Stars />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-8 py-6">
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
                <Link
                    href={redirectTo}
                    className="mt-6 flex w-fit items-center gap-2 text-sm text-white/70 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                {/* Centered card */}
                <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
                    <form
                        onSubmit={handleSignIn}
                        className="w-full max-w-md rounded-3xl border border-white/8 bg-white/8 p-8 backdrop-blur-md"
                    >
                        <div className="text-center">
                            <h1 className="font-[Be1space] text-4xl tracking-wide">Sign In</h1>
                            <p className="mt-3 text-white/55">
                                Log in to save your favorite study spots and personalize your experience.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="NYU email or personal email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-white/8 bg-white/8 px-5 py-4 text-white outline-none placeholder:text-white/35"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-white/8 bg-white/8 px-5 py-4 text-white outline-none placeholder:text-white/35"
                                required
                            />

                            {error && (
                                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 rounded-full bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </div>

                        <div className="mt-6 text-center text-sm text-white/55">
                            <p>
                                Don’t have an account?{" "}
                                <Link
                                    href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                                    className="text-cyan-300 hover:text-cyan-200"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#13213a] px-3 text-white/45">or</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="mt-6 w-full rounded-full border border-white/10 bg-white/8 px-6 py-4 text-sm font-medium text-white/80 hover:bg-white/10"
                            >
                                Continue with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
