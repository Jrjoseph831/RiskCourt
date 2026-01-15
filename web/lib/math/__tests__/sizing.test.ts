import { describe, expect, it } from 'vitest';

import { kellyFraction, stakeSize } from '../sizing';

describe('kellyFraction', () => {
  it('returns zero when no edge', () => {
    expect(kellyFraction(0.5, 2)).toBeCloseTo(0, 8);
  });

  it('returns positive Kelly for edge', () => {
    expect(kellyFraction(0.55, 2)).toBeCloseTo(0.1, 8);
  });
});

describe('stakeSize', () => {
  it('calculates stake with caps', () => {
    const result = stakeSize({
      bankroll: 1000,
      modelProb: 0.55,
      americanOdds: 100,
      kellyMultiplier: 0.25,
      maxStakePct: 0.02,
      minStake: 0,
    });

    expect(result.kelly).toBeCloseTo(0.1, 8);
    expect(result.stake).toBeCloseTo(20, 8);
    expect(result.capped).toBe(true);
    expect(result.reasons).toContain('maxStakePct');
  });

  it('returns zero stake when kelly is zero', () => {
    const result = stakeSize({
      bankroll: 1000,
      modelProb: 0.5,
      americanOdds: 100,
      kellyMultiplier: 0.25,
      maxStakePct: 0.02,
      minStake: 0,
    });

    expect(result.stake).toBe(0);
    expect(result.reasons).toContain('kelly<=0');
  });

  it('applies min stake', () => {
    const result = stakeSize({
      bankroll: 1000,
      modelProb: 0.51,
      americanOdds: 120,
      kellyMultiplier: 0.01,
      maxStakePct: 0.5,
      minStake: 5,
    });

    expect(result.stake).toBe(5);
    expect(result.capped).toBe(true);
    expect(result.reasons).toContain('minStake');
  });
});

describe('stakeSize validation', () => {
  it('rejects invalid inputs', () => {
    expect(() =>
      stakeSize({
        bankroll: -1,
        modelProb: 0.55,
        americanOdds: 100,
        kellyMultiplier: 0.25,
        maxStakePct: 0.02,
        minStake: 0,
      }),
    ).toThrow('bankroll must be greater than or equal to 0');
  });
});
