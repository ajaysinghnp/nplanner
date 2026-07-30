import { NextResponse } from "next/server";

import { checkDatabaseConnection } from "@/lib/db/health";

export async function GET() {
  try {
    const result = await checkDatabaseConnection();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        connected: false,
      },
      {
        status: 503,
      }
    );
  }
}
