import { Result, ok } from 'neverthrow';
import { DomainError } from '../errors/domain.errors';

export type SkillType =
  | 'COMBO_ATTACK'
  | 'CRITICAL'
  | 'CONFUSE'
  | 'MIRROR'
  | 'SMOKE'
  | 'LIGHTNING'
  | 'WIND'
  | 'GHOST'
  | 'FREEZE';

export interface SkillTriggerResult {
  triggeredSkills: {
    skillId: SkillType;
    durationMs: number;
    power: number;
  }[];
}

export class SkillEngine {
  /**
   * Evaluates if a new combo value reached a threshold to trigger automated skills.
   *
   * @param previousCombo combo count before evaluation
   * @param currentCombo combo count after keystroke
   */
  static evaluateComboTriggers(
    previousCombo: number,
    currentCombo: number
  ): Result<SkillTriggerResult, DomainError> {
    const triggeredSkills: { skillId: SkillType; durationMs: number; power: number }[] = [];

    // Check threshold crossings
    if (previousCombo < 25 && currentCombo >= 25) {
      triggeredSkills.push({ skillId: 'COMBO_ATTACK', durationMs: 0, power: 15 });
    }
    if (previousCombo < 50 && currentCombo >= 50) {
      triggeredSkills.push({ skillId: 'SMOKE', durationMs: 4000, power: 1 });
    }
    if (previousCombo < 100 && currentCombo >= 100) {
      triggeredSkills.push({ skillId: 'CONFUSE', durationMs: 5000, power: 2 });
    }

    return ok({ triggeredSkills });
  }
}
