// AARIKA AI service boundary
// AI providers are intentionally abstracted. No model credentials belong in the client.
export async function generateInsight({ context, task }) {
  if (!context || !task) throw new Error("AI task and context are required.");
  throw new Error("AI provider is not connected yet. This boundary will be wired through a secure server-side service.");
}

export const AI_CAPABILITIES = Object.freeze([
  "attendance-insight",
  "academic-insight",
  "administrative-summary",
  "maintenance-triage",
  "report-summary"
]);
