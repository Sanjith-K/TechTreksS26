import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    const { id: user_id } = await params;

    const { data: favorites, error } = await supabase
        .from("favorites")
        .select("*, Spaces(*)")
        .eq("user_id", user_id);

    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    const { data: allFavs } = await supabase.from("favorites").select("space_id");
    const counts = {};
    for (const row of allFavs || []) {
        counts[row.space_id] = (counts[row.space_id] || 0) + 1;
    }

    const result = (favorites || []).map((fav) => {
        if (fav.Spaces) {
            fav.Spaces.favorite_count = counts[fav.Spaces.google_place_id] || 0;
        }
        return fav;
    });

    return NextResponse.json(result);
}

export async function POST(request, { params }) {
    const { id: user_id } = await params;
    const { space_id } = await request.json();

    const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id, space_id })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") return NextResponse.json({ message: "already favorited" });
        return NextResponse.json({ detail: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
