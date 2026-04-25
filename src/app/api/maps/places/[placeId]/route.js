const FIELDS = [
    "name",
    "formatted_address",
    "formatted_phone_number",
    "website",
    "opening_hours",
    "rating",
    "user_ratings_total",
    "photos",
    "price_level",
].join(",");

export async function GET(_req, { params }) {
    const { placeId } = await params;

    if (!placeId) {
        return Response.json({ error: "Missing placeId" }, { status: 400 });
    }

    const key = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${FIELDS}&key=${key}`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
    const data = await res.json();

    if (data.status !== "OK") {
        return Response.json({ error: data.status, message: data.error_message ?? null }, { status: 502 });
    }

    // Rewrite photo references to go through our proxy so the key stays server-side
    const result = data.result;
    if (result.photos) {
        result.photos = result.photos.slice(0, 5).map((p) => ({
            url: `/api/maps/photo?ref=${encodeURIComponent(p.photo_reference)}&maxwidth=800`,
            width: p.width,
            height: p.height,
        }));
    }

    return Response.json(result, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
}
