"use client";

export default function EmptyState({
    title = "Nothing here yet",
    description = "Try adjusting your filters or search to see results.",
    action,
}) {
    return (
        <div className="rounded-3xl border border-dashed border-white/12 bg-white/6 p-8 text-center backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/55">{description}</p>
            {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
        </div>
    );
}
