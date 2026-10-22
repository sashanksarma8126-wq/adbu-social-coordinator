import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/aiService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const aiService = new AIService();
    const status = await aiService.checkStatus();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      {
        available: false,
        provider: process.env.GROQ_API_KEY ? "Groq Cloud" : "Ollama Local",
        endpoint: process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : "http://localhost:11434",
        error: error.message || "AI service is not currently available.",
        instructions:
          "To connect AI:\n1. For Free Cloud AI (24/7): Add GROQ_API_KEY to your .env or Vercel settings (100% free, no credit card at https://console.groq.com)\n2. For Local AI: Run 'ollama run llama3.2' at http://localhost:11434",
      },
      { status: 200 }
    );
  }
}
