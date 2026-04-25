export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    const maxwidth = searchParams.get("maxwidth") ?? "800";

    if (!ref) {
        return new Response("Missing ref", { status: 400 });
    }

    const key = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${encodeURIComponent(ref)}&key=${key}`;

    const res = await fetch(url);
    if (!res.ok) {
        return new Response("Photo not found", { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const body = await res.arrayBuffer();

    return new Response(body, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, immutable",
        },
    });
}
