export function getOptions(obj: Record<string, string>): Array<{ label: string; value: string }> {
  return Object.keys(obj).map((key) => ({ label: obj[key], value: key }))
}


