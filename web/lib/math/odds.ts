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

const assertNonZero = (name: string, value: number): void => {
  assertFiniteNumber(name, value);
  if (value === 0) {
    throw new Error(`${name} must be non-zero`);
  }
};

const assertDecimalOdds = (name: string, value: number): void => {
  assertFiniteNumber(name, value);
  if (value <= 1) {
    throw new Error(`${name} must be greater than 1`);
  }
};

export const americanToDecimal = (american: number): number => {
  assertNonZero('american', american);
  return american > 0 ? 1 + american / 100 : 1 + 100 / Math.abs(american);
};

export const decimalToAmerican = (decimal: number): number => {
  assertDecimalOdds('decimal', decimal);
  return decimal >= 2 ? (decimal - 1) * 100 : -100 / (decimal - 1);
};

export const americanToImpliedProb = (american: number): number => {
  assertNonZero('american', american);
  const abs = Math.abs(american);
  return american > 0 ? 100 / (abs + 100) : abs / (abs + 100);
};

export const decimalToImpliedProb = (decimal: number): number => {
  assertDecimalOdds('decimal', decimal);
  return 1 / decimal;
};

export const devigTwoWayProportional = (
  p1: number,
  p2: number,
): { fair1: number; fair2: number } => {
  assertProbability('p1', p1);
  assertProbability('p2', p2);
  const total = p1 + p2;
  if (total <= 0) {
    throw new Error('probability sum must be greater than 0');
  }
  return {
    fair1: p1 / total,
    fair2: p2 / total,
  };
};

export const devigFromAmericanTwoWay = (
  a1: number,
  a2: number,
): {
  fair1: number;
  fair2: number;
  fairOddsAmerican1: number;
  fairOddsAmerican2: number;
} => {
  const p1 = americanToImpliedProb(a1);
  const p2 = americanToImpliedProb(a2);
  const { fair1, fair2 } = devigTwoWayProportional(p1, p2);
  const fairOddsAmerican1 = decimalToAmerican(1 / fair1);
  const fairOddsAmerican2 = decimalToAmerican(1 / fair2);
  return { fair1, fair2, fairOddsAmerican1, fairOddsAmerican2 };
};

export const edgeProb = (modelProb: number, marketProb: number): number => {
  assertProbability('modelProb', modelProb);
  assertProbability('marketProb', marketProb);
  return modelProb - marketProb;
};

export const expectedValueDecimal = (
  modelProb: number,
  decimalOdds: number,
): number => {
  assertProbability('modelProb', modelProb);
  assertDecimalOdds('decimalOdds', decimalOdds);
  return modelProb * (decimalOdds - 1) - (1 - modelProb);
};

export const expectedValueAmerican = (
  modelProb: number,
  americanOdds: number,
): number => {
  assertProbability('modelProb', modelProb);
  const decimalOdds = americanToDecimal(americanOdds);
  return expectedValueDecimal(modelProb, decimalOdds);
};
