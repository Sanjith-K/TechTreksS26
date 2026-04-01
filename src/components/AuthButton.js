"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AuthButton() {
    const pathname = usePathname();
    const { user, isSignedIn } = useAuth();

    if (!isSignedIn) {
        return (
            <Link
                href={`/signin?redirect=${encodeURIComponent(pathname)}`}
                className="rounded-full border border-white/30 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
            >
                Sign in
            </Link>
        );
    }

    return (
        <Link
            href="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white"
        >
            {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
        </Link>
    );
}