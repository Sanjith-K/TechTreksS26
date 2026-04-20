import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(request, { params }) {
    const { id: user_id, spaceId: space_id } = await params;

    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user_id)
        .eq("space_id", space_id);

    if (error) return NextResponse.json({ detail: error.message }, { status: 500 });

    return NextResponse.json({ message: "Favorite removed" });
}
