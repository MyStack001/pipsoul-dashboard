import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PIPSOUL_AI_SYSTEM_PROMPT } from "@/lib/ai/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Create a Supabase client using the user's access token
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's message
    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Prevent unnecessarily huge requests
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      );
    }

    // Ask OpenAI
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: PIPSOUL_AI_SYSTEM_PROMPT,
      input: message,
      max_output_tokens: 500,
    });

    return NextResponse.json({
      message: response.output_text,
    });
  } catch (error) {
    console.error("Pipsoul AI error:", error);

    return NextResponse.json(
      {
        error: "Unable to get a response from Pipsoul AI.",
      },
      { status: 500 }
    );
  }
}