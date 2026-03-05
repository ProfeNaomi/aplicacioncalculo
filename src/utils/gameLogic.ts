export type World = 'numeros' | 'algebra' | 'geometria' | 'estadistica';
export type GameType = 'suma' | 'resta' | 'multiplicacion' | 'division' | 'factores' | 'combinada' | 'potencia' | 'raiz' | 'factorizacion' | 'producto_notable';

export interface Question {
  text: string;
  answer: number | string;
  options?: string[];
}

export function generateQuestion(type: GameType, difficulty: number, history: Set<string>): Question {
  let q: Question;
  let attempts = 0;
  do {
    if (type === 'factorizacion' || type === 'producto_notable') {
      q = createAlgebraQuestion(type, difficulty);
    } else {
      q = createQuestion(type, difficulty);
    }
    attempts++;
  } while (history.has(q.text) && attempts < 50);
  return q;
}

function createAlgebraQuestion(type: 'factorizacion' | 'producto_notable', difficulty: number): Question {
  const vars = ['x', 'y', 'a', 'b', 'm', 'n'];
  const v1 = vars[Math.floor(Math.random() * vars.length)];
  const v2 = (Math.random() > 0.5)
    ? vars.filter(v => v !== v1)[Math.floor(Math.random() * (vars.length - 1))]
    : (Math.floor(Math.random() * 5) + 1).toString();

  const c1Num = Math.floor(Math.random() * 5) + 2;
  const c1 = c1Num.toString();
  const c2Num = Math.floor(Math.random() * 5) + 1;
  const c2 = c2Num.toString();

  const cases = [
    // 1. Factor común: c1*x² + c1*c2*x -> c1*x(x + c2)
    { exp: `${c1}${v1}² + ${c1Num * c2Num}${v1}`, fac: `${c1}${v1}(${v1} + ${c2})` },
    // 2. Cuadrado de binomio (positivo): x² + 2*c2*x + c2² -> (x + c2)²
    { exp: `${v1}² + ${2 * c2Num}${v1} + ${c2Num * c2Num}`, fac: `(${v1} + ${c2})²` },
    // 3. Cuadrado de binomio (negativo): x² - 2*c2*x + c2² -> (x - c2)²
    { exp: `${v1}² - ${2 * c2Num}${v1} + ${c2Num * c2Num}`, fac: `(${v1} - ${c2})²` },
    // 4. Suma por diferencia: x² - c2² -> (x + c2)(x - c2)
    { exp: `${v1}² - ${c2Num * c2Num}`, fac: `(${v1} + ${c2})(${v1} - ${c2})` },
    // 5. Suma de cubos: x³ + c2³ -> (x + c2)(x² - c2*x + c2²)
    { exp: `${v1}³ + ${c2Num * c2Num * c2Num}`, fac: `(${v1} + ${c2})(${v1}² - ${c2Num}${v1} + ${c2Num * c2Num})` },
    // 6. Diferencia de cubos: x³ - c2³ -> (x - c2)(x² + c2*x + c2²)
    { exp: `${v1}³ - ${c2Num * c2Num * c2Num}`, fac: `(${v1} - ${c2})(${v1}² + ${c2Num}${v1} + ${c2Num * c2Num})` },
    // 7. Suma al cubo: x³ + 3*c2*x² + 3*c2²*x + c2³ -> (x + c2)³
    { exp: `${v1}³ + ${3 * c2Num}${v1}² + ${3 * c2Num * c2Num}${v1} + ${c2Num * c2Num * c2Num}`, fac: `(${v1} + ${c2})³` },
    // 8. Diferencia al cubo: x³ - 3*c2*x² + 3*c2²*x - c2³ -> (x - c2)³
    { exp: `${v1}³ - ${3 * c2Num}${v1}² + ${3 * c2Num * c2Num}${v1} - ${c2Num * c2Num * c2Num}`, fac: `(${v1} - ${c2})³` },
  ];

  const selectedCase = cases[Math.floor(Math.random() * cases.length)];

  // Wrong options can be other cases with same variables, or slightly mutated signs
  const optionsSet = new Set<string>();
  const isFactoring = type === 'factorizacion';
  const correctAnswer = isFactoring ? selectedCase.fac : selectedCase.exp;
  const questionText = isFactoring ? selectedCase.exp : selectedCase.fac;

  optionsSet.add(correctAnswer);

  let genAttempts = 0;
  while (optionsSet.size < 4 && genAttempts < 50) {
    const fakeC2Num = Math.floor(Math.random() * 5) + 1;
    const fakeCase = cases[Math.floor(Math.random() * cases.length)];
    // Just modify the string of the fake case slightly to make options
    let fakeStr = isFactoring ? fakeCase.fac : fakeCase.exp;
    fakeStr = fakeStr.replace(new RegExp(c2, 'g'), fakeC2Num.toString());

    // Add mutations like changing + to - randomly
    if (Math.random() > 0.5) fakeStr = fakeStr.replace('+', '-');

    if (fakeStr !== correctAnswer) {
      optionsSet.add(fakeStr);
    }
    genAttempts++;
  }

  // fallback if less than 4
  while (optionsSet.size < 4) {
    optionsSet.add(correctAnswer + ' + ' + optionsSet.size); // should not happen often due to random
  }

  return {
    text: questionText,
    answer: correctAnswer,
    options: Array.from(optionsSet).sort(() => Math.random() - 0.5)
  };
}

function createQuestion(type: GameType, difficulty: number): Question {
  // difficulty starts at 1, increases every 4 points now

  switch (type) {
    case 'suma': {
      const max = 10 + Math.floor(difficulty * 6);
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      return { text: `${a} + ${b}`, answer: a + b };
    }
    case 'resta': {
      const max = 10 + Math.floor(difficulty * 6);
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      const num1 = Math.max(a, b);
      const num2 = Math.min(a, b);
      return { text: `${num1} - ${num2}`, answer: num1 - num2 };
    }
    case 'multiplicacion': {
      const maxA = 3 + difficulty;
      const maxB = 3 + Math.floor(difficulty * 1.5);
      const a = Math.floor(Math.random() * maxA) + 2;
      const b = Math.floor(Math.random() * maxB) + 2;
      return { text: `${a} × ${b}`, answer: a * b };
    }
    case 'division': {
      const maxDivisor = 3 + difficulty;
      const maxQuotient = 3 + Math.floor(difficulty * 1.5);
      const b = Math.floor(Math.random() * maxDivisor) + 2; // divisor
      const c = Math.floor(Math.random() * maxQuotient) + 2; // quotient
      const a = b * c; // dividend
      return { text: `${a} ÷ ${b}`, answer: c };
    }
    case 'factores': {
      const maxA = 2 + difficulty;
      const maxB = 2 + Math.floor(difficulty * 1.5);
      const a = Math.floor(Math.random() * maxA) + 2;
      const b = Math.floor(Math.random() * maxB) + 2;
      const target = a * b;
      const correct = `${a} × ${b}`;
      const options = new Set<string>([correct]);

      let attempts = 0;
      while (options.size < 4 && attempts < 100) {
        const fakeA = Math.floor(Math.random() * (maxA + 3)) + 2;
        const fakeB = Math.floor(Math.random() * (maxB + 3)) + 2;
        if (fakeA * fakeB !== target) {
          options.add(`${fakeA} × ${fakeB}`);
        }
        attempts++;
      }

      const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
      return { text: target.toString(), answer: correct, options: shuffledOptions };
    }
    case 'combinada': {
      const max = 2 + Math.floor(difficulty * 0.8);
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      const c = Math.floor(Math.random() * max) + 1;
      if (Math.random() > 0.5) {
        return { text: `${a} + ${b} × ${c}`, answer: a + b * c };
      } else {
        return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
      }
    }
    case 'potencia': {
      const maxBase = 5 + difficulty;
      const base = Math.floor(Math.random() * maxBase) + 2; // 2 to (5 + diff)

      // Select exponent 2 or 3
      const isSquared = Math.random() > 0.3; // 70% chance of square, 30% cube
      const exp = isSquared ? 2 : 3;

      // Limit cubes to smaller numbers initially
      const finalBase = exp === 3 && base > 6 ? (Math.floor(Math.random() * 4) + 2) : base;

      const symbol = exp === 2 ? '²' : '³';
      return { text: `${finalBase}${symbol}`, answer: Math.pow(finalBase, exp) };
    }
    case 'raiz': {
      const maxRoot = 5 + difficulty * 2;
      const root = Math.floor(Math.random() * maxRoot) + 3; // Answer is from 3 to ...
      const perfectSquare = root * root;
      return { text: `√${perfectSquare}`, answer: root };
    }
  }
}
