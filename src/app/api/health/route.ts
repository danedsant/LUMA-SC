import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  const configured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!configured) {
    return NextResponse.json({
      ok: true,
      service: "luma",
      db: "not_configured",
      ms: Date.now() - started,
    });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("aptos")
      .select("id", { head: true, count: "exact" })
      .limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, service: "luma", db: "error", error: error.message },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      service: "luma",
      db: "ok",
      ms: Date.now() - started,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "luma",
        db: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
