"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import AuthButton from "../../components/AuthButton";
import SpaceCard from "../../components/SpaceCard";
import Stars from "../../components/Stars";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
    ensureProfile,
} from "@/lib/favorites";
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
        favoriteCount: s.favorite_count ?? 0,
    };
}

function mapRecent(space) {
    return {
        id: space.id,
        name: space.name || "Unknown Space",
        address: space.address || "",
        rating: "—",
        price: PRICE_MAP[space.price_range] || "$",
        vibe: space.vibe || "—",
        distance: "—",
        tags: parseTags(space.tags),
        favoriteCount: space.favoriteCount ?? 0,
    };
}

const SETTINGS_SECTIONS = [
    {
        id: "notifications",
        title: "Notifications",
        description: "Choose when Be1 space should reach you.",
        icon: Bell,
    },
    {
        id: "privacy",
        title: "Privacy & Security",
        description: "Control profile visibility and account safety.",
        icon: Shield,
    },
    {
        id: "preferences",
        title: "Preferences",
        description: "Set defaults for search and saved activity.",
        icon: SlidersHorizontal,
    },
    {
        id: "support",
        title: "Help & Support",
        description: "Get help, report a problem, or send feedback.",
        icon: CircleHelp,
    },
];

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 p-4 text-left hover:bg-white/10"
        >
            <span>
                <span className="block text-sm font-medium text-white">{label}</span>
                <span className="mt-1 block text-xs text-white/45">{description}</span>
            </span>
            <span
                className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${checked ? "bg-fuchsia-600" : "bg-white/15"
                    }`}
            >
                <span
                    className={`h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </span>
        </button>
    );
}

export default function ProfilePage() {
    const { user, isSignedIn, setUser } = useAuth();
    const router = useRouter();

    const [favoriteSpaces, setFavoriteSpaces] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [recentSpaces, setRecentSpaces] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("favorites");
    const [activeSetting, setActiveSetting] = useState("notifications");
    const [settings, setSettings] = useState({
        emailUpdates: true,
        favoriteAlerts: true,
        privateProfile: false,
        twoStepLogin: false,
        saveRecent: true,
        nyuFirst: true,
    });

    const initial =
        user?.name?.[0]?.toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "U";

    useEffect(() => {
        async function loadFavorites() {
            if (!isSignedIn || !user?.id) {
                setFavoriteSpaces([]);
                setFavoriteIds([]);
                setFavoritesLoading(false);
                return;
            }

            try {
                setFavoritesLoading(true);
                const data = await getFavorites(user.id);

                if (Array.isArray(data)) {
                    setFavoriteSpaces(data.map(mapFavorite));
                    setFavoriteIds(data.map((item) => item.space_id));

                    const countMap = {};
                    data.forEach((item) => {
                        const sid = item?.Spaces?.google_place_id;
                        const count = item?.Spaces?.favorite_count ?? 0;
                        if (sid) countMap[sid] = count;
                    });

                    setRecentSpaces((prev) =>
                        prev.map((space) => ({
                            ...space,
                            favoriteCount: countMap[space.id] ?? space.favoriteCount ?? 0,
                        }))
                    );
                } else {
                    setFavoriteSpaces([]);
                    setFavoriteIds([]);
                }
            } catch (err) {
                console.error("Failed to load profile favorites:", err);
                setFavoriteSpaces([]);
                setFavoriteIds([]);
            } finally {
                setFavoritesLoading(false);
            }
        }

        loadFavorites();
    }, [isSignedIn, user]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("recentSpaces") || "[]");
        setRecentSpaces(Array.isArray(stored) ? stored.map(mapRecent) : []);
    }, []);

    async function toggleFavorite(spaceId) {
        try {
            if (!user?.id) {
                alert("Please sign in first.");
                return;
            }

            const wasFavorited = favoriteIds.includes(spaceId);

            if (wasFavorited) {
                await removeFavorite(user.id, spaceId);

                setFavoriteIds((prev) => prev.filter((id) => id !== spaceId));
                setFavoriteSpaces((prev) =>
                    prev
                        .filter((space) => space.id !== spaceId)
                        .map((space) =>
                            space.id === spaceId
                                ? { ...space, favoriteCount: Math.max((space.favoriteCount ?? 0) - 1, 0) }
                                : space
                        )
                );

                setRecentSpaces((prev) =>
                    prev.map((space) =>
                        space.id === spaceId
                            ? { ...space, favoriteCount: Math.max((space.favoriteCount ?? 0) - 1, 0) }
                            : space
                    )
                );
            } else {
                try {
                    await addFavorite(user.id, spaceId);
                } catch (err) {
                    if (err.message && err.message.includes("23503")) {
                        await ensureProfile(user);
                        await addFavorite(user.id, spaceId);
                    } else {
                        throw err;
                    }
                }

                setFavoriteIds((prev) => [...prev, spaceId]);

                const recentMatch = recentSpaces.find((space) => space.id === spaceId);

                if (recentMatch) {
                    setFavoriteSpaces((prev) => {
                        if (prev.some((space) => space.id === spaceId)) {
                            return prev.map((space) =>
                                space.id === spaceId
                                    ? { ...space, favoriteCount: (space.favoriteCount ?? 0) + 1 }
                                    : space
                            );
                        }

                        return [
                            { ...recentMatch, favoriteCount: (recentMatch.favoriteCount ?? 0) + 1 },
                            ...prev,
                        ];
                    });
                }

                setRecentSpaces((prev) =>
                    prev.map((space) =>
                        space.id === spaceId
                            ? { ...space, favoriteCount: (space.favoriteCount ?? 0) + 1 }
                            : space
                    )
                );
            }
        } catch (err) {
            console.error("Favorite toggle failed:", err);
        }
    }

    function handleLogout() {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
    }

    function toggleSetting(key) {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }

    function renderSettingContent() {
        if (activeSetting === "notifications") {
            return (
                <div className="space-y-3">
                    <ToggleRow
                        label="Email updates"
                        description="Receive important account and space updates by email."
                        checked={settings.emailUpdates}
                        onChange={() => toggleSetting("emailUpdates")}
                    />
                    <ToggleRow
                        label="Favorite spot alerts"
                        description="Get notified when saved spaces add discounts or update details."
                        checked={settings.favoriteAlerts}
                        onChange={() => toggleSetting("favoriteAlerts")}
                    />
                </div>
            );
        }

        if (activeSetting === "privacy") {
            return (
                <div className="space-y-3">
                    <ToggleRow
                        label="Private profile"
                        description="Hide your saved activity from other students."
                        checked={settings.privateProfile}
                        onChange={() => toggleSetting("privateProfile")}
                    />
                    <ToggleRow
                        label="Two-step login"
                        description="Add an extra check when signing in on a new device."
                        checked={settings.twoStepLogin}
                        onChange={() => toggleSetting("twoStepLogin")}
                    />
                    <Link
                        href="/profile"
                        className="block rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/80 hover:bg-white/10"
                    >
                        Review account information
                    </Link>
                </div>
            );
        }

        if (activeSetting === "preferences") {
            return (
                <div className="space-y-3">
                    <ToggleRow
                        label="Save recent spaces"
                        description="Keep recently viewed places on your profile."
                        checked={settings.saveRecent}
                        onChange={() => toggleSetting("saveRecent")}
                    />
                    <ToggleRow
                        label="Show NYU-friendly spots first"
                        description="Prioritize student discounts and nearby campus options."
                        checked={settings.nyuFirst}
                        onChange={() => toggleSetting("nyuFirst")}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                            href="/discover"
                            className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/80 hover:bg-white/10"
                        >
                            Open discovery filters
                        </Link>
                        <Link
                            href="/map"
                            className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/80 hover:bg-white/10"
                        >
                            Change map area
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <Link
                    href="/discover"
                    className="block rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/80 hover:bg-white/10"
                >
                    Browse study spaces
                </Link>
                <a
                    href="mailto:support@be1space.app"
                    className="block rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/80 hover:bg-white/10"
                >
                    Contact support
                </a>
                <button
                    type="button"
                    onClick={() => alert("Thanks for the feedback!")}
                    className="block w-full rounded-2xl border border-white/8 bg-white/5 p-4 text-left text-sm text-white/80 hover:bg-white/10"
                >
                    Send feedback
                </button>
            </div>
        );
    }

    const selectedSetting =
        SETTINGS_SECTIONS.find((section) => section.id === activeSetting) ||
        SETTINGS_SECTIONS[0];

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#07152b] text-white">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_#071224,_#0a1830,_#071224)]" />
                <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.14),_rgba(59,130,246,0.07),_transparent_68%)] blur-2xl" />
            </div>

            <Stars />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pb-36 pt-6">
                <header className="flex items-center justify-between">
                    <Link href="/" className="flex items-end gap-1">
                        <h1 className="font-[Be1Logo5] text-5xl tracking-wide sm:text-6xl">
                            Be1
                        </h1>
                        <span className="font-[Be1Logo5] text-2xl tracking-wide text-white/70 sm:text-3xl">
                            space
                        </span>
                    </Link>

                    <AuthButton />
                </header>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/70 hover:text-white">
                    <Link href="/discover" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                {!isSignedIn ? (
                    <section className="mt-10 rounded-3xl border border-white/8 bg-white/8 p-8 text-center backdrop-blur-md">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-3xl font-semibold">
                            <User size={36} />
                        </div>

                        <h1 className="mt-6 text-3xl font-semibold">No profile yet</h1>
                        <p className="mt-3 text-white/55">
                            Sign in to view your profile, favorites, and personalized study spaces.
                        </p>

                        <Link
                            href="/signin?redirect=/profile"
                            className="mt-6 inline-block rounded-full bg-fuchsia-600 px-6 py-3 text-sm font-medium text-white hover:bg-fuchsia-500"
                        >
                            Sign in to continue
                        </Link>
                    </section>
                ) : (
                    <>
                        <section className="mt-6 overflow-hidden rounded-3xl border border-white/8 bg-white/8 backdrop-blur-md">
                            <div className="rounded-b-3xl bg-[#0c1b37] px-6 py-8">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-3xl font-semibold">
                                            {initial}
                                        </div>

                                        <button className="absolute bottom-0 right-0 rounded-full bg-fuchsia-600 p-2 text-white shadow-md hover:bg-fuchsia-500">
                                            <Pencil size={14} />
                                        </button>
                                    </div>

                                    <h1 className="mt-4 text-3xl font-semibold">
                                        {user?.name || "User"}
                                    </h1>
                                    <p className="mt-1 text-white/55">
                                        {user?.email || "No email available"}
                                    </p>

                                    <div className="mt-6 flex gap-10 text-center">
                                        <div>
                                            <p className="text-2xl font-semibold">0</p>
                                            <p className="text-sm text-white/45">Followers</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold">0</p>
                                            <p className="text-sm text-white/45">Following</p>
                                        </div>
                                    </div>

                                    <button className="mt-6 rounded-full bg-fuchsia-600 px-6 py-2 text-sm font-medium text-white hover:bg-fuchsia-500">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl bg-white/5 p-4 text-center">
                                        <p className="text-2xl font-semibold">{favoriteIds.length}</p>
                                        <p className="mt-1 text-sm text-white/45">Favorites</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 p-4 text-center">
                                        <p className="text-2xl font-semibold">0</p>
                                        <p className="mt-1 text-sm text-white/45">Visited</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 p-4 text-center">
                                        <p className="text-2xl font-semibold">0</p>
                                        <p className="mt-1 text-sm text-white/45">Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mt-8">
                            <div className="mb-5 flex gap-3">
                                <button
                                    onClick={() => setActiveTab("favorites")}
                                    className={`rounded-full px-4 py-2 text-sm ${activeTab === "favorites"
                                        ? "bg-fuchsia-600 text-white"
                                        : "border border-white/10 bg-white/8 text-white/70"
                                        }`}
                                >
                                    Favorites
                                </button>

                                <button
                                    onClick={() => setActiveTab("recent")}
                                    className={`rounded-full px-4 py-2 text-sm ${activeTab === "recent"
                                        ? "bg-fuchsia-600 text-white"
                                        : "border border-white/10 bg-white/8 text-white/70"
                                        }`}
                                >
                                    Recent
                                </button>
                            </div>

                            {activeTab === "favorites" ? (
                                favoritesLoading ? (
                                    <div className="rounded-2xl border border-white/8 bg-white/8 p-5 text-white/60 backdrop-blur-md">
                                        Loading favorites...
                                    </div>
                                ) : favoriteSpaces.length === 0 ? (
                                    <div className="rounded-2xl border border-white/8 bg-white/8 p-5 text-white/60 backdrop-blur-md">
                                        No favorites saved yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {favoriteSpaces.map((space) => (
                                            <Link key={space.id} href={`/stores/${space.id}`} className="block">
                                                <SpaceCard
                                                    {...space}
                                                    favoriteCount={space.favoriteCount}
                                                    isFavorited={favoriteIds.includes(space.id)}
                                                    onToggleFavorite={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(space.id);
                                                    }}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                )
                            ) : recentSpaces.length === 0 ? (
                                <div className="rounded-2xl border border-white/8 bg-white/8 p-5 text-white/60 backdrop-blur-md">
                                    No recent spaces yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {recentSpaces.map((space) => (
                                        <Link key={space.id} href={`/stores/${space.id}`} className="block">
                                            <SpaceCard
                                                {...space}
                                                favoriteCount={space.favoriteCount}
                                                isFavorited={favoriteIds.includes(space.id)}
                                                onToggleFavorite={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleFavorite(space.id);
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="mt-8">
                            <h2 className="mb-4 text-2xl font-semibold">Settings</h2>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                                <div className="space-y-3">
                                    {SETTINGS_SECTIONS.map((section) => {
                                        const Icon = section.icon;
                                        const isActive = activeSetting === section.id;

                                        return (
                                            <button
                                                key={section.id}
                                                type="button"
                                                onClick={() => setActiveSetting(section.id)}
                                                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left backdrop-blur-md hover:bg-white/10 ${isActive
                                                    ? "border-fuchsia-400/40 bg-fuchsia-500/15"
                                                    : "border-white/8 bg-white/8"
                                                    }`}
                                                aria-expanded={isActive}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon size={18} className={isActive ? "text-fuchsia-300" : "text-white/70"} />
                                                    <div>
                                                        <span className="block">{section.title}</span>
                                                        <span className="mt-1 block text-xs text-white/45">
                                                            {section.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={isActive ? "text-fuchsia-200" : "text-white/35"}>
                                                    {">"}
                                                </span>
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left text-red-300 backdrop-blur-md hover:bg-red-500/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={18} />
                                            <span>Log Out</span>
                                        </div>
                                        <span className="text-red-300/60">{">"}</span>
                                    </button>
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/8 p-5 backdrop-blur-md">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold">{selectedSetting.title}</h3>
                                        <p className="mt-1 text-sm text-white/50">
                                            {selectedSetting.description}
                                        </p>
                                    </div>

                                    {renderSettingContent()}
                                </div>
                            </div>
                        </section>

                        <div className="mt-10 text-center text-sm text-white/35">
                            <p>Be in1 v1.0.0</p>
                            <p className="mt-1">Made for NYU Students 💜</p>
                        </div>
                    </>
                )}
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
