import { AIProvider, AIProviderStatus } from "./types";

export class OllamaProvider implements AIProvider {
  name = "Ollama Local";
  private endpoint: string;
  private defaultModel: string;

  constructor() {
    this.endpoint = process.env.OLLAMA_ENDPOINT || "http://localhost:11434";
    this.defaultModel = process.env.OLLAMA_MODEL || "llama3.2";
  }

  async checkStatus(): Promise<AIProviderStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          available: false,
          provider: this.name,
          endpoint: this.endpoint,
          error: `Ollama returned HTTP ${res.status}`,
          instructions:
            "Local AI is not currently available. Ensure Ollama is running at http://localhost:11434.",
        };
      }

      const data = await res.json();
      const models = Array.isArray(data.models)
        ? data.models.map((m: any) => m.name)
        : [];

      const activeModel = models.includes(this.defaultModel)
        ? this.defaultModel
        : models[0] || this.defaultModel;

      return {
        available: true,
        provider: this.name,
        endpoint: this.endpoint,
        model: activeModel,
        availableModels: models,
      };
    } catch (err: any) {
      return {
        available: false,
        provider: this.name,
        endpoint: this.endpoint,
        error: "Local AI is not currently available.",
        instructions:
          "To connect Local AI:\n1. Download and install Ollama from https://ollama.com\n2. Open your terminal and run: ollama run llama3.2 (or ollama serve)\n3. Verify that http://localhost:11434 is accessible, then click 'Retry AI Connection'.",
      };
    }
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const status = await this.checkStatus();
    if (!status.available) {
      throw new Error(
        status.instructions || "Local AI is not currently available."
      );
    }

    const model = status.model || this.defaultModel;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout for local inference

    try {
      const res = await fetch(`${this.endpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.6,
            num_predict: 2048,
          },
        }),
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Ollama generation failed with status ${res.status}`);
      }

      const data = await res.json();
      return data.response || "";
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("Local AI generation timed out. Please try with a lighter model or shorter prompt.");
      }
      throw err;
    }
  }
}
