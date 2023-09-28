export function verifyName(name: string): boolean {
  return /^[A-Z][a-zA-Z\d]*$/.test(name);
}
