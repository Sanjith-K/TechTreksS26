import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    const { spaceId } = await params;

    const { data } = await supabase
        .from("live_occupancy")
        .select("*")
        .eq("space_id", spaceId)
        .single();

    if (!data) {
        return NextResponse.json({ space_id: spaceId, current_status: "unknown", total_votes: 0 });
    }

    return NextResponse.json(data);
}
