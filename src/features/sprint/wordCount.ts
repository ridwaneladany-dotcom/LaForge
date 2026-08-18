export function countWords(content: string): number {
  const words = content.trim().match(/\S+/gu);
  return words?.length ?? 0;
}
