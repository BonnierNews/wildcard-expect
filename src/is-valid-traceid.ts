export function isValidTraceId(traceId: string): boolean {
  const traceIdRegex = /^[0-9a-f]{32}$/i;
  return traceIdRegex.test(traceId);
}
