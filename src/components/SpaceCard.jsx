"use client";

import { Heart } from "lucide-react";

export default function SpaceCard({
    name,
    address,
    rating,
    price,
    vibe,
    distance,
    tags = [],
    isFavorited = false,
    onToggleFavorite,
    favoriteCount,
}) {
    return (
        <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:border-cyan-400/20 hover:bg-white/10">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-white">{name}</h2>
                    <p className="mt-2 text-sm text-white/55">{address}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {favoriteCount > 0 && (
                        <div className="rounded-full bg-pink-500/15 px-3 py-1 text-sm text-pink-300">
                            ♥ {favoriteCount}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onToggleFavorite}
                        disabled={!onToggleFavorite}
                        aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition ${isFavorited
                                ? "border-pink-400/40 bg-pink-500/20 text-pink-300 shadow-[0_0_18px_rgba(244,114,182,0.28)]"
                                : "border-white/10 bg-white/8 text-white/70 hover:bg-white/12 hover:text-pink-200"
                            } ${!onToggleFavorite ? "cursor-default opacity-80" : ""}`}
                    >
                        <Heart
                            size={17}
                            className={isFavorited ? "fill-current" : ""}
                        />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-white/75">
                <span className="rounded-full bg-blue-500/30 px-2 py-1">{price}</span>
                <span>•</span>
                <span>{vibe}</span>
                <span>•</span>
                <span>{distance}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-white/8 px-3 py-1 text-xs text-white/70"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}