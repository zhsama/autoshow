// Browser-safe utilities that can be used in both client and server
export function sanitizeContent(content: string): string {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

// Simple logging utilities
export const l = console.log
export const err = console.error
