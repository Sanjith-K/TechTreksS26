import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
    const body = await request.json();
    const { id, username, email } = body;

    if (!id) return NextResponse.json({ detail: "id is required" }, { status: 400 });

    const { data, error } = await supabase
        .from("Profiles")
        .upsert({ id, username: username || "", email: email || "" }, { onConflict: "id" })
        .select()
        .single();

    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    return NextResponse.json(data || { id });
}
