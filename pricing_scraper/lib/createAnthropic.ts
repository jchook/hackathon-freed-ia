import Anthropic from "@anthropic-ai/sdk";
import { AiApi } from "../types";
import dotenv from 'dotenv';
import { PricingError } from "./pricingError";

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY as string;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL as string;
const ANTHROPIC_MAX_TOKENS = parseInt(process.env.ANTHROPIC_MAX_TOKENS as string, 10);

let remainingTokens = ANTHROPIC_MAX_TOKENS;

export const createAnthropic = (): AiApi => {

  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });
  
  return {
    execute: async (content: string): Promise<string> => {

      if (remainingTokens <= 0) {
        throw new PricingError('Not enough tokens remaining');
      }

      const claudeResponse = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 20000,
        messages: [{
          role: 'user',
          content,
        }]
      });

      const {usage: {input_tokens: inputTokens, output_tokens: outputTokens}} = claudeResponse;

      remainingTokens -= inputTokens + outputTokens;

      return (claudeResponse as any).content[0].text; 
    },
    resetTokens: () => {
      remainingTokens = ANTHROPIC_MAX_TOKENS;
    }
  }
};
