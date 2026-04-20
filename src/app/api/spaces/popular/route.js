import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const { data: favData } = await supabase.from("favorites").select("space_id");
    const counts = {};
    for (const row of favData || []) {
        counts[row.space_id] = (counts[row.space_id] || 0) + 1;
    }

    if (!Object.keys(counts).length) return NextResponse.json([]);

    const topIds = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id);

    const { data, error } = await supabase
        .from("Spaces")
        .select("*")
        .in("google_place_id", topIds);

    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    const spaces = (data || [])
        .map((s) => ({ ...s, favorite_count: counts[s.google_place_id] || 0 }))
        .sort((a, b) => b.favorite_count - a.favorite_count);

    return NextResponse.json(spaces);
}
