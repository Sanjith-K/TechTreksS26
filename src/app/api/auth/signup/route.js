import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
    const { name, email, password } = await request.json();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    });

    if (error) return NextResponse.json({ detail: error.message }, { status: 400 });
    if (!data.user) return NextResponse.json({ detail: "Signup failed." }, { status: 400 });

    await supabase.from("Profiles").insert({
        id: data.user.id,
        username: name,
        email,
    }).then(() => {}).catch(() => {});

    return NextResponse.json({ message: "Account created successfully." });
}
