import { calculateDeviationPoints } from './audi-feature-ranking';

describe('audi-feature-ranking', () => {
  describe('calculateDeviationPoints', () => {
    it('returns max amount of points for exact amount match', () => {
      expect(calculateDeviationPoints(100, 100, 5, 10)).toBe(10);
    });

    it('returns max amount of points if within base deviation amount', () => {
      expect(calculateDeviationPoints(100, 96, 5, 10)).toBe(10);
    })

    it('returns 1 less points if within 1 percent after base deviation amount', () => {
      expect(calculateDeviationPoints(100, 94, 5, 10)).toBe(9);
    })

    it('returns 2 less points if within 1 percent after base deviation amount', () => {
      expect(calculateDeviationPoints(100, 93, 5, 10)).toBe(8);
    })
  })
})