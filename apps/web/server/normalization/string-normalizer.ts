const punctuationPattern = /[.,/\\()"'&+_-]+/g
const whitespacePattern = /\s+/g

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-IN")
    .replace(punctuationPattern, " ")
    .replace(whitespacePattern, " ")
    .trim()
}

export function normalizeCompanyName(value: string) {
  return normalizeText(value)
}

export function normalizeRoleName(value: string) {
  return normalizeText(value)
}
