export function removeMaybeSuffix(suffix: string, str: string) {
  if (!str.endsWith(suffix))
    return str
  return str.slice(0, -suffix.length)
}
