"use client";

export default function LoadingState({
    title = "Loading",
    description = "Please wait while we load your content.",
    children,
}) {
    return (
        <div className="rounded-3xl border border-white/8 bg-white/8 p-6 backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-white/55">{description}</p>

            {children ? (
                <div className="mt-6">{children}</div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-white/8 bg-white/6 p-4 backdrop-blur-md"
                        >
                            <div className="h-6 w-2/5 animate-pulse rounded-full bg-white/12" />
                            <div className="mt-3 h-4 w-3/5 animate-pulse rounded-full bg-white/8" />
                            <div className="mt-5 h-4 w-4/5 animate-pulse rounded-full bg-white/8" />
                            <div className="mt-4 flex gap-2">
                                <div className="h-7 w-14 animate-pulse rounded-full bg-white/10" />
                                <div className="h-7 w-20 animate-pulse rounded-full bg-white/8" />
                                <div className="h-7 w-16 animate-pulse rounded-full bg-white/8" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
