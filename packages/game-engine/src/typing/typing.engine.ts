import { Result, ok, err } from 'neverthrow';
import { InvalidTypingInputError, DomainError } from '../errors/domain.errors';

export interface TypingEvaluation {
  isCorrect: boolean;
  newCombo: number;
  progressPercent: number;
  charIndex: number;
}

export class TypingEngine {
  /**
   * Evaluates a keystroke against the target text cleanly and deterministically.
   *
   * @param targetText the full prompt string
   * @param currentCharIndex the index the user is attempting to type
   * @param typedChar the single character submitted
   * @param currentCombo user's current combo counter before this stroke
   */
  static evaluateChar(
    targetText: string,
    currentCharIndex: number,
    typedChar: string,
    currentCombo: number
  ): Result<TypingEvaluation, DomainError> {
    if (!targetText || targetText.length === 0) {
      return err(new InvalidTypingInputError('Target text cannot be empty'));
    }
    if (currentCharIndex < 0 || currentCharIndex >= targetText.length) {
      return err(new InvalidTypingInputError(`Character index out of bounds (${currentCharIndex})`));
    }
    if (!typedChar || typedChar.length !== 1) {
      return err(new InvalidTypingInputError('Typed character must be exactly one character'));
    }

    const expectedChar = targetText[currentCharIndex];
    const isCorrect = expectedChar === typedChar;
    const newCombo = isCorrect ? currentCombo + 1 : 0;
    const nextIndex = isCorrect ? currentCharIndex + 1 : currentCharIndex;
    const progressPercent = Math.min(100, Math.round((nextIndex / targetText.length) * 100));

    return ok({
      isCorrect,
      newCombo,
      progressPercent,
      charIndex: nextIndex,
    });
  }
}
