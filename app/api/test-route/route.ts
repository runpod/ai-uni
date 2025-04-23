import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ message: "Test route is working" });
}

export async function POST() {
	return NextResponse.json({ message: "POST request received" });
}
