import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    if (!SUPPORTED_LANGUAGES.includes(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to set locale" },
      { status: 500 }
    );
  }
}
