"use client";

export default function SpaceCard({
    name,
    address,
    rating,
    price,
    vibe,
    distance,
    tags,
}) {
    return (
        <div className="rounded-2xl border border-white/8 bg-white/8 p-4 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:border-cyan-400/20 hover:bg-white/10">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">{name}</h2>
                    <p className="mt-2 text-sm text-white/55">{address}</p>
                </div>

                <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/85">
                    ⭐ {rating}
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
                {(tags || []).map((tag) => (
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