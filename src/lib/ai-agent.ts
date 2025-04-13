import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { Pica } from "@picahq/ai";

export class AIAgent {
  private model: ChatGoogleGenerativeAI;
  private pica: Pica;

  constructor(geminiApiKey: string, picaApiKey: string) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      modelName: "gemini-2.0-flash",
      maxOutputTokens: 2048,
      temperature: 0.7,
    });

    this.pica = new Pica(picaApiKey, {
      connectors: ["*"],
    });
  }

  async processUserInput(input: string): Promise<string> {
    try {
      // Get the system prompt and tools from Pica
      const system = await this.pica.generateSystemPrompt();
      const tools = this.pica.oneTool;

      // Create messages array for Gemini
      const messages = [
        new HumanMessage({
          content: input,
          additional_kwargs: {
            system,
            tools
          }
        })
      ];

      // Use Gemini to process the input
      const chain = RunnableSequence.from([
        this.model,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke(messages);

      // Execute any tool actions if needed
      if (tools && response.includes('```tool_code')) {
        const toolResponse = await this.pica.execute({
          input: response,
          stream: false
        });
        return toolResponse.output || response;
      }

      return response;
    } catch (error) {
      console.error("💥 Error processing input:", error);
      throw new Error("Failed to process input");
    }
  }
}

