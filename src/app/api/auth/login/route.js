import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return NextResponse.json({ detail: error.message }, { status: 401 });
    if (!data.user) return NextResponse.json({ detail: "Invalid email or password." }, { status: 401 });

    const { data: profile } = await supabase
        .from("Profiles")
        .select("*")
        .eq("email", data.user.email)
        .single();

    let name = profile?.username;

    if (!profile) {
        name = data.user.user_metadata?.name || email.split("@")[0];
        await supabase.from("Profiles").insert({
            id: data.user.id,
            username: name,
            email,
        }).then(() => {}).catch(() => {});
    }

    return NextResponse.json({
        user: { id: data.user.id, email: data.user.email, name },
    });
}
