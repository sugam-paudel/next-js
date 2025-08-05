const englishToNepaliMap: { [key: string]: string } = {
  // ...existing map...
}

const numberMap: { [key: string]: string } = {
  // ...existing map...
}

export function convertToNepali(text: string): string {
  let result = text.toLowerCase()
  for (const [eng, nep] of Object.entries(numberMap)) {
    result = result.replace(new RegExp(eng, 'g'), nep)
  }
  const sortedKeys = Object.keys(englishToNepaliMap).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    const regex = new RegExp(key, 'gi')
    result = result.replace(regex, englishToNepaliMap[key])
  }
  return result
}