export function capitaliseFirstLetter (sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

export function camelCaseToPascalCaseWithSpaces (sentence: string): string {
  return capitaliseFirstLetter(sentence.replace(/[A-Z]/g, (capturedString: string) => ` ${capturedString}`))
}
