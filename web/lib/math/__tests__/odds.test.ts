import { describe, expect, it } from 'vitest';

import {
  americanToDecimal,
  americanToImpliedProb,
  decimalToAmerican,
  decimalToImpliedProb,
  devigFromAmericanTwoWay,
  devigTwoWayProportional,
  edgeProb,
  expectedValueAmerican,
  expectedValueDecimal,
} from '../odds';

describe('odds conversions', () => {
  it('converts american to decimal', () => {
    expect(americanToDecimal(150)).toBeCloseTo(2.5, 8);
    expect(americanToDecimal(-200)).toBeCloseTo(1.5, 8);
  });

  it('converts decimal to american', () => {
    expect(decimalToAmerican(2.5)).toBeCloseTo(150, 8);
    expect(decimalToAmerican(1.5)).toBeCloseTo(-200, 8);
  });

  it('converts american to implied probability', () => {
    expect(americanToImpliedProb(150)).toBeCloseTo(0.4, 8);
    expect(americanToImpliedProb(-200)).toBeCloseTo(0.6666667, 6);
  });

  it('converts decimal to implied probability', () => {
    expect(decimalToImpliedProb(2.5)).toBeCloseTo(0.4, 8);
  });
});

describe('devig two-way proportional', () => {
  it('normalizes probabilities to fair', () => {
    const { fair1, fair2 } = devigTwoWayProportional(0.55, 0.5);
    expect(fair1).toBeCloseTo(0.5238095, 7);
    expect(fair2).toBeCloseTo(0.4761905, 7);
    expect(fair1 + fair2).toBeCloseTo(1, 8);
  });

  it('converts american odds to fair odds', () => {
    const result = devigFromAmericanTwoWay(-110, -110);
    expect(result.fair1).toBeCloseTo(0.5, 8);
    expect(result.fair2).toBeCloseTo(0.5, 8);
    expect(result.fairOddsAmerican1).toBeCloseTo(100, 8);
    expect(result.fairOddsAmerican2).toBeCloseTo(100, 8);
  });
});

describe('edge and expected value', () => {
  it('calculates edge', () => {
    expect(edgeProb(0.55, 0.5)).toBeCloseTo(0.05, 8);
  });

  it('calculates EV for decimal odds', () => {
    expect(expectedValueDecimal(0.55, 2)).toBeCloseTo(0.1, 8);
  });

  it('calculates EV for american odds', () => {
    expect(expectedValueAmerican(0.55, 100)).toBeCloseTo(0.1, 8);
  });
});

describe('input validation', () => {
  it('rejects invalid inputs', () => {
    expect(() => americanToDecimal(0)).toThrow('american must be non-zero');
    expect(() => decimalToAmerican(1)).toThrow('decimal must be greater than 1');
    expect(() => decimalToImpliedProb(0.9)).toThrow('decimal must be greater than 1');
    expect(() => devigTwoWayProportional(1, 0.5)).toThrow(
      'p1 must be between 0 and 1 (exclusive)',
    );
  });
});
