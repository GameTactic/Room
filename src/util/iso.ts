export class ISO {
  static timestamp (): number {
    const date = new Date()
    return date.getTime()
  }
}
