export function getEventIndex(): string {
  const today = new Date().toISOString().split('T')[0];
  return `events-${today}`;
}