import { americanToDecimal } from './odds';

const assertFiniteNumber = (name: string, value: number): void => {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
};

const assertProbability = (name: string, value: number): void => {
  assertFiniteNumber(name, value);
  if (value <= 0 || value >= 1) {
    throw new Error(`${name} must be between 0 and 1 (exclusive)`);
  }
};

const assertDecimalOdds = (name: string, value: number): void => {
  assertFiniteNumber(name, value);
  if (value <= 1) {
    throw new Error(`${name} must be greater than 1`);
  }
};

export const kellyFraction = (modelProb: number, decimalOdds: number): number => {
  assertProbability('modelProb', modelProb);
  assertDecimalOdds('decimalOdds', decimalOdds);
  const b = decimalOdds - 1;
  const raw = (decimalOdds * modelProb - 1) / b;
  return Math.max(0, raw);
};

type StakeSizeInput = {
  bankroll: number;
  modelProb: number;
  americanOdds: number;
  kellyMultiplier: number;
  maxStakePct: number;
  minStake: number;
  maxStake?: number;
};

type StakeSizeOutput = {
  stake: number;
  kelly: number;
  capped: boolean;
  reasons: string[];
};

export const stakeSize = ({
  bankroll,
  modelProb,
  americanOdds,
  kellyMultiplier,
  maxStakePct,
  minStake,
  maxStake,
}: StakeSizeInput): StakeSizeOutput => {
  assertFiniteNumber('bankroll', bankroll);
  if (bankroll < 0) {
    throw new Error('bankroll must be greater than or equal to 0');
  }
  assertProbability('modelProb', modelProb);
  assertFiniteNumber('kellyMultiplier', kellyMultiplier);
  if (kellyMultiplier < 0) {
    throw new Error('kellyMultiplier must be greater than or equal to 0');
  }
  assertFiniteNumber('maxStakePct', maxStakePct);
  if (maxStakePct < 0 || maxStakePct > 1) {
    throw new Error('maxStakePct must be between 0 and 1');
  }
  assertFiniteNumber('minStake', minStake);
  if (minStake < 0) {
    throw new Error('minStake must be greater than or equal to 0');
  }
  if (maxStake !== undefined) {
    assertFiniteNumber('maxStake', maxStake);
    if (maxStake < 0) {
      throw new Error('maxStake must be greater than or equal to 0');
    }
  }

  const decimalOdds = americanToDecimal(americanOdds);
  const kelly = kellyFraction(modelProb, decimalOdds);
  const reasons: string[] = [];
  const maxStakeByPct = bankroll * maxStakePct;
  let stake = bankroll * kelly * kellyMultiplier;
  let capped = false;

  if (stake === 0) {
    reasons.push('kelly<=0');
    return { stake: 0, kelly, capped, reasons };
  }

  if (stake > maxStakeByPct) {
    stake = maxStakeByPct;
    capped = true;
    reasons.push('maxStakePct');
  }

  if (maxStake !== undefined && stake > maxStake) {
    stake = maxStake;
    capped = true;
    reasons.push('maxStake');
  }

  if (stake > 0 && stake < minStake) {
    stake = minStake;
    capped = true;
    reasons.push('minStake');
  }

  return { stake, kelly, capped, reasons };
};
