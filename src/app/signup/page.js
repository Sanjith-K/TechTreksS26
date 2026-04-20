"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Stars from "../../components/Stars";
import { signup } from "@/lib/auth";

function SignUpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get("redirect") || "/discover";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!name || !email || !password || !confirm) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const data = await signup({ name, email, password });

            setMessage(data.message || "Account created successfully.");

            setTimeout(() => {
                router.push(`/signin?redirect=${encodeURIComponent(redirectTo)}`);
            }, 1200);
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.message || "Could not connect to server.");
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
                <header className="flex items-center justify-between">
                    <Link href="/" className="flex items-end gap-1">
                        <h1 className="font-[Be1Logo5] text-5xl tracking-wide sm:text-6xl">
                            Be1
                        </h1>
                        <span className="font-[Be1Logo5] text-2xl tracking-wide text-white/70 sm:text-3xl">
                            space
                        </span>
                    </Link>
                </header>

                <Link
                    href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
                    className="mt-6 flex w-fit items-center gap-2 text-sm text-white/70 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
                    <form
                        onSubmit={handleSignup}
                        className="w-full max-w-md rounded-3xl border border-white/8 bg-white/8 p-8 backdrop-blur-md"
                    >
                        <div className="text-center">
                            <h1 className="font-[Be1space] text-4xl tracking-wide">
                                Create Account
                            </h1>
                            <p className="mt-3 text-white/55">
                                Join Be1space to save your favorite spots and build your study routine.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-2xl border border-white/8 bg-white/8 px-5 py-4 text-white outline-none placeholder:text-white/35"
                                required
                            />

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
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-white/8 bg-white/8 px-5 py-4 text-white outline-none placeholder:text-white/35"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full rounded-2xl border border-white/8 bg-white/8 px-5 py-4 text-white outline-none placeholder:text-white/35"
                                required
                            />

                            {error && (
                                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 rounded-full bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </div>

                        <div className="mt-8 text-center text-sm text-white/55">
                            <p>
                                Already have an account?{" "}
                                <Link
                                    href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
                                    className="text-cyan-300 hover:text-cyan-200"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}

export default function SignUpPageWrapper() {
    return <Suspense><SignUpPage /></Suspense>;
}