import { NextResponse } from "next/server";

export async function GET() {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
        return NextResponse.json({ error: "Maps key not configured" }, { status: 500 });
    }
    return NextResponse.json({ key });
}
