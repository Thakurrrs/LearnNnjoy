export function personalize(text: string, name: string): string {
  const hero = name.trim() || "Explorer";
  return text.replaceAll("{hero}", hero);
}
