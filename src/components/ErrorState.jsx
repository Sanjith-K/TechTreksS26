"use client";

export default function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load this content. Please try again.",
    onRetry,
}) {
    return (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/8 p-8 text-center backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/65">{description}</p>
            {onRetry ? (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onRetry}
                        className="rounded-full bg-red-500/90 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-500"
                    >
                        Try Again
                    </button>
                </div>
            ) : null}
        </div>
    );
}
