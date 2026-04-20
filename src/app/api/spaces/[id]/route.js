import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("Spaces")
        .select("*")
        .eq("google_place_id", id)
        .single();

    if (error || !data) return NextResponse.json({ detail: "Space not found" }, { status: 404 });

    const { data: favData } = await supabase.from("favorites").select("space_id");
    const counts = {};
    for (const row of favData || []) {
        counts[row.space_id] = (counts[row.space_id] || 0) + 1;
    }

    return NextResponse.json({ ...data, favorite_count: counts[data.google_place_id] || 0 });
}
