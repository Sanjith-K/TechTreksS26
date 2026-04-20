import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from("Profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return NextResponse.json({ detail: "Profile not found" }, { status: 404 });

    return NextResponse.json(data);
}
