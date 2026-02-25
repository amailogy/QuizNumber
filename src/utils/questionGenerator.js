/**
 * ランダム整数を返す (min ~ max)
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 難易度に応じたNの最大値
 */
function getMaxN(questionNumber) {
  if (questionNumber <= 5) return 3;
  if (questionNumber <= 15) return 5;
  if (questionNumber <= 30) return 8;
  return 12;
}

/**
 * 問題を生成する
 * @param {number} questionNumber - 現在の問題番号 (1始まり)
 * @param {number[]} answerHistory - 過去の正解の配列 (index 0 = Q1の正解)
 * @returns {{ text: string, answer: number }}
 */
export function generateQuestion(questionNumber, answerHistory) {
  // Q1: 固定問題
  if (questionNumber === 1) {
    return { text: '今何問目？', answer: 1 };
  }

  // Q2: ○問先は何問目？
  if (questionNumber === 2) {
    const n = randInt(1, 3);
    return {
      text: `${n}問先は何問目？`,
      answer: questionNumber + n,
    };
  }

  // Q3: ○問前は何問目？
  if (questionNumber === 3) {
    const n = randInt(1, 2);
    return {
      text: `${n}問前は何問目？`,
      answer: questionNumber - n,
    };
  }

  // Q4以降: ランダム
  const maxN = getMaxN(questionNumber);
  const types = ['ahead', 'behind'];

  if (questionNumber >= 5 && answerHistory.length >= 2) {
    types.push('past_answer');
  }
  if (questionNumber >= 8) {
    types.push('compound');
  }

  const type = types[randInt(0, types.length - 1)];

  switch (type) {
    case 'ahead': {
      const n = randInt(1, maxN);
      return {
        text: `${n}問先は何問目？`,
        answer: questionNumber + n,
      };
    }

    case 'behind': {
      const n = randInt(1, Math.min(maxN, questionNumber - 1));
      return {
        text: `${n}問前は何問目？`,
        answer: questionNumber - n,
      };
    }

    case 'past_answer': {
      const maxBack = Math.min(maxN, answerHistory.length - 1);
      const n = randInt(1, Math.max(1, maxBack));
      const pastIndex = answerHistory.length - n;
      const pastAnswer = answerHistory[pastIndex];
      const pastQ = questionNumber - n;
      return {
        text: `${n}問前の答えは何だった？`,
        answer: pastAnswer,
        hint: `(Q${pastQ}の答え)`,
      };
    }

    case 'compound': {
      const a = randInt(2, maxN);
      const b = randInt(1, a - 1);
      return {
        text: `${a}問先の${b}問前は何問目？`,
        answer: questionNumber + a - b,
      };
    }

    default: {
      const n = randInt(1, maxN);
      return {
        text: `${n}問先は何問目？`,
        answer: questionNumber + n,
      };
    }
  }
}
