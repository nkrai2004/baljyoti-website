// AARIKA Agentic AI runtime boundary
// Agents will only act through explicit, permission-checked tools.
export class AarikaAgentRuntime {
  constructor({ actor, tools = {} } = {}) { this.actor = actor; this.tools = tools; }
  canUse(toolName) { return Boolean(this.tools[toolName]); }
  async execute(toolName, input) {
    if (!this.actor) throw new Error("Agent actor context is required.");
    if (!this.canUse(toolName)) throw new Error(`Agent tool is not enabled: ${toolName}`);
    return this.tools[toolName](input, this.actor);
  }
}
