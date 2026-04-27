"use client";

import { useLayoutEffect, useRef, memo } from "react";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import AuthButton from "./AuthButton";

const FILTER_CHIPS = [
    { k: "wifi", label: "WiFi" },
    { k: "quiet", label: "Quiet" },
    { k: "nyuDiscount", label: "NYU Discount" },
    { k: "laptopOk", label: "Laptop OK" },
];

function MapPageToolbarComponent({ search, onSearchChange, chips, onToggleChip }) {
    const inputRef = useRef(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const shouldRestoreRef = useRef(false);

    const handleInputChange = (e) => {
        const t = e.target;
        if (t.selectionStart != null && t.selectionEnd != null) {
            selectionRef.current = { start: t.selectionStart, end: t.selectionEnd };
        }
        shouldRestoreRef.current = true;
        onSearchChange(e);
    };

    useLayoutEffect(() => {
        if (!shouldRestoreRef.current || !inputRef.current) return;
        shouldRestoreRef.current = false;
        const { start, end } = selectionRef.current;
        const el = inputRef.current;
        el.focus({ preventScroll: true });
        try {
            if (el.setSelectionRange) {
                el.setSelectionRange(start, end);
            }
        } catch {
            /* ignore if input type doesn't support */
        }
    }, [search]);

    return (
        <header
            className="shrink-0 bg-[#07152b]/95 py-3 px-4 backdrop-blur-md"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <Link href="/" className="font-[Be1Logo5] text-2xl tracking-wide sm:text-3xl">
                        Be1
                    </Link>
                    <span className="font-[Be1Logo5] text-sm tracking-wide text-white/70 sm:text-base">
                        space
                    </span>
                    <Link
                        href="/discover"
                        className="ml-1 flex shrink-0 items-center text-white/50 hover:text-white"
                        aria-label="Back to discover"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                </div>
                <div className="shrink-0">
                    <AuthButton />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] py-2.5 pl-3 pr-3 transition-shadow focus-within:ring-2 focus-within:ring-violet-500/40">
                    <Search
                        className="pointer-events-none h-[18px] w-[18px] shrink-0 text-white/45"
                        strokeWidth={2}
                        aria-hidden
                    />
                    <input
                        ref={inputRef}
                        id="map-page-search-input"
                        type="text"
                        name="map-space-search"
                        inputMode="search"
                        enterKeyHint="search"
                        value={search}
                        onChange={handleInputChange}
                        placeholder="Search spaces…"
                        aria-label="Search spaces by name or address"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none ring-0 placeholder:text-white/35"
                    />
                </div>

                <div
                    className="flex min-w-0 flex-wrap items-center gap-1"
                    role="group"
                    aria-label="Filter spaces"
                >
                    {FILTER_CHIPS.map(({ k, label }) => (
                        <button
                            key={k}
                            type="button"
                            aria-pressed={chips[k]}
                            onClick={() => onToggleChip(k)}
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 sm:px-3 ${
                                chips[k]
                                    ? "border-[#7c3aed] bg-[#7c3aed]/25 text-violet-100"
                                    : "border-white/10 bg-white/[0.05] text-white/55 hover:border-white/20"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}

const MapPageToolbar = memo(MapPageToolbarComponent);
export default MapPageToolbar;
