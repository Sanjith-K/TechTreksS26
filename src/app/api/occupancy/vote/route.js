import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
    const { space_id, vote } = await request.json();

    if (!["quiet", "moderate", "busy"].includes(vote)) {
        return NextResponse.json({ detail: "Vote must be 'quiet', 'moderate', or 'busy'" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("occupancy_votes")
        .insert({ space_id, vote })
        .select();

    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    return NextResponse.json({ message: "Vote submitted", data });
}
