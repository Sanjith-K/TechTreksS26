export async function GET(req) {
    const { searchParams } = new URL(req.url);

    // Never let a client-supplied key through — always use the server key
    searchParams.delete("key");
    searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY);

    // Forward the browser's Referer so Google's HTTP-referrer restrictions still work
    const referer = req.headers.get("referer");
    const fetchHeaders = referer ? { Referer: referer } : {};

    const res = await fetch(
        `https://maps.googleapis.com/maps/api/js?${searchParams.toString()}`,
        { headers: fetchHeaders }
    );

    if (!res.ok) {
        return new Response("Failed to load Maps API", { status: 502 });
    }

    const js = await res.text();

    return new Response(js, {
        headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
