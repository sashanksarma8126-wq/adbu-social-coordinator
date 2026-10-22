import { AIProvider, AIProviderStatus } from "./types";

export class GroqProvider implements AIProvider {
  name = "Groq Cloud (Llama 3.3)";
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";
    this.model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  }

  async checkStatus(): Promise<AIProviderStatus> {
    if (!this.apiKey) {
      return {
        available: false,
        provider: this.name,
        endpoint: "https://api.groq.com/openai/v1",
        error: "GROQ_API_KEY is not configured",
        instructions:
          "To use Groq Cloud (100% free, no credit card required):\n1. Go to https://console.groq.com and log in with Google or GitHub.\n2. Create a free API key at https://console.groq.com/keys.\n3. Add GROQ_API_KEY=gsk_... to your .env file or Vercel environment variables.",
      };
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!res.ok) {
        return {
          available: false,
          provider: this.name,
          endpoint: "https://api.groq.com/openai/v1",
          error: `Groq authentication failed (HTTP ${res.status}). Verify your GROQ_API_KEY.`,
        };
      }

      return {
        available: true,
        provider: this.name,
        endpoint: "https://api.groq.com/openai/v1",
        model: this.model,
        availableModels: [
          "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant",
          "mixtral-8x7b-32768",
        ],
      };
    } catch (err: any) {
      return {
        available: false,
        provider: this.name,
        endpoint: "https://api.groq.com/openai/v1",
        error: `Could not reach Groq API: ${err.message}`,
      };
    }
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const status = await this.checkStatus();
    if (!status.available) {
      throw new Error(status.error || "Groq Cloud is not available.");
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.6,
          response_format: { type: "json_object" },
        }),
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("Groq API request timed out after 60 seconds.");
      }
      throw err;
    }
  }
}
