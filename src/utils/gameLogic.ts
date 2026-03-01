export type GameType = 'suma' | 'resta' | 'multiplicacion' | 'division' | 'factores' | 'combinada';

export interface Question {
  text: string;
  answer: number | string;
  options?: string[];
}

export function generateQuestion(type: GameType, difficulty: number, history: Set<string>): Question {
  let q: Question;
  let attempts = 0;
  do {
    q = createQuestion(type, difficulty);
    attempts++;
  } while (history.has(q.text) && attempts < 50);
  return q;
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
  }
}
