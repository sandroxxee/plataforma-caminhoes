import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    console.info("whatsapp_click", {
      truckId: body?.truckId || null,
      path: body?.path || null,
      referrer: body?.referrer || null,
      clickedAt: body?.clickedAt || new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
