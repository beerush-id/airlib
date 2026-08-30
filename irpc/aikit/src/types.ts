export type AIInput = Record<string, unknown>;
export type AIOutput = Record<string, unknown>;
export type AIDriver = {
  submit(input: AIInput): Promise<AIOutput>;
};
