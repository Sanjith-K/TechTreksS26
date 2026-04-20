import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("Spaces")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    return NextResponse.json(data || []);
}
