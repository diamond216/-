/**
 * Splits text into searchable words. Thai is written without spaces, so splitting on
 * whitespace would turn a whole phrase into one token and a query from the middle of
 * it would find nothing. Intl.Segmenter knows where Thai words begin and end.
 */
export class ThaiAwareTokenizer {
  private readonly segmenter = new Intl.Segmenter("th", { granularity: "word" });

  tokenize(text: string): string[] {
    const tokens: string[] = [];
    for (const part of this.segmenter.segment(text)) {
      if (part.isWordLike) tokens.push(part.segment.toLowerCase());
    }
    return tokens;
  }
}
