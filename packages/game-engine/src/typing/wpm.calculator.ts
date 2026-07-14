import { Result, ok, err } from 'neverthrow';
import { InvalidTypingInputError, DomainError } from '../errors/domain.errors';

export interface TypingStats {
  grossWpm: number;
  netWpm: number;
  accuracy: number; // percentage 0-100
}

export class WpmCalculator {
  /**
   * Calculates typing statistics strictly deterministically.
   * Standard: 5 characters = 1 word.
   *
   * @param totalTypedChars total characters typed so far
   * @param correctChars characters matching the target text exactly
   * @param elapsedSeconds elapsed time in seconds (> 0)
   */
  static calculate(
    totalTypedChars: number,
    correctChars: number,
    elapsedSeconds: number
  ): Result<TypingStats, DomainError> {
    if (elapsedSeconds <= 0) {
      return err(new InvalidTypingInputError('Elapsed seconds must be greater than zero'));
    }
    if (totalTypedChars < 0 || correctChars < 0 || correctChars > totalTypedChars) {
      return err(new InvalidTypingInputError('Character counts must be non-negative and valid'));
    }

    const elapsedMinutes = elapsedSeconds / 60;
    const grossWords = totalTypedChars / 5;
    const grossWpm = Math.round(grossWords / elapsedMinutes);

    const errors = totalTypedChars - correctChars;
    const netWords = Math.max(0, (correctChars - errors) / 5);
    const netWpm = Math.round(netWords / elapsedMinutes);

    const accuracy = totalTypedChars === 0 ? 100 : Math.round((correctChars / totalTypedChars) * 100);

    return ok({
      grossWpm,
      netWpm,
      accuracy,
    });
  }
}
