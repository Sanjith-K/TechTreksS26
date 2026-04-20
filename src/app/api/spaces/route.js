import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function getFavoriteCounts() {
    const { data } = await supabase.from("favorites").select("space_id");
    const counts = {};
    for (const row of data || []) {
        counts[row.space_id] = (counts[row.space_id] || 0) + 1;
    }
    return counts;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    let query = supabase.from("Spaces").select("*");

    const nyu_discount = searchParams.get("nyu_discount");
    const wifi = searchParams.get("wifi");
    const noise_level = searchParams.get("noise_level");
    const laptop_friendly = searchParams.get("laptop_friendly");
    const price_range = searchParams.get("price_range");

    if (nyu_discount !== null) query = query.eq("nyu_discount", nyu_discount === "true");
    if (wifi !== null) query = query.eq("wifi", wifi === "true");
    if (noise_level) query = query.eq("noise_level", noise_level.toLowerCase());
    if (laptop_friendly !== null) query = query.eq("laptop_friendly", laptop_friendly === "true");
    if (price_range !== null) query = query.eq("price_range", parseInt(price_range));

    const { data, error } = await query;
    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    const counts = await getFavoriteCounts();
    const spaces = (data || []).map((s) => ({
        ...s,
        favorite_count: counts[s.google_place_id] || 0,
    }));

    return NextResponse.json(spaces);
}
