// Source: https://freshcardsapp.com/srs/simulator/
// But with some modifications

import { SuperMemoEvaluation, SuperMemoItem } from "~/types/dictionary";

/**
 * An approximation of the Anki algorithm:
 *
 * This is a naive implementation of Anki's algorithm. This is not 100% accurate and
 * was put together based on documentation other folks wrote up on the web. Anki's
 * scheduling algorithm code is tied very closely to its data model, so it's a bit
 * complicated to walk through.
 *
 * Like SM-2, Anki's algorithm uses a 5.0 scale for measuring how well you remember a
 * card during a lesson. "Failed" cards get a 2.0 score, cards you got right but had
 * difficulty remember get 3.0, "good" cards get 4.0, and "easy" cards get 5.0.
 *
 * Here are the general notes about how the algorithm works.
 *
 * - initial 'n' values use short (less than 24h) intervals this is also known as the
 *   "learning" phase during the learning phase, the efactor is not affected this
 *   also applies if a card goes back into "re-learning"
 * - first repetition is in 1 minute, 2nd in 10, 3rd 24h
 * - cards you answer late, but still get right are given an efactor boost
 * - "easy" cards get an additional boost to efactor (0.15) so that the interval gets
 *   stretched out more for those cases
 * - cards that are marked for "again" (i.e. failing) have their efactor reduced by 0.2
 * - hard cards (score of 3) have efactor reduced by 0.15 and interval is increased
 *   by 1.2 instead of the efactor
 * - score of 4.0 (good) does not affect efactor
 * - a small amount of "fuzz" is added to interval to make sure the same cards aren't
 *   reviewed together as a group
 */

export const srsFunc = (previous: SuperMemoItem, evaluation: SuperMemoEvaluation) => {
  var n, efactor, interval;

  const daysFromMinutes = (min: number) => {
    return min / (24.0 * 60.0);
  };

  // if (previous == null) {
  //   previous = {n: 0, efactor: 2.5, interval: 1.0};
  // }

  if (previous.n <= 2) {
    // Still in learning phase, so do not change efactor
    efactor = previous.efactor;

    // if did failed card, reset n and interval
    if (evaluation.score < 3) {
      n = 0;

      // Due in 1minute
      interval = 1.0 / (24.0 * 60.0);
    } else {
      n = previous.n + 1;

      switch (evaluation.score) {
        case 3: // hard
          if (n == 1) {
            interval = daysFromMinutes(8);
          } else if (n == 2) {
            interval = daysFromMinutes(6 * 60);
          } else {
            interval = 1.0;
          }
          break;

        case 4: // good
          if (n == 1) {
            interval = daysFromMinutes(15);
          } else if (n == 2) {
            interval = daysFromMinutes(12 * 60);
          } else {
            interval = 1.0;
          }
          break;

        default: // easy
          interval = 4.0; // 4 days
          break;
      }
    }
  } else {
    // Reviewing phase
    if (evaluation.score < 3) {
      // Failed, so reset interval to 1m
      n = 0;
      interval = daysFromMinutes(1);

      // Reduce efactor
      efactor = Math.max(1.3, previous.efactor - 0.2);
    } else {
      // Passed
      let latenessDays = Math.max(0, evaluation.lateness * previous.interval);
      var latenessBonus = 0.0;
      if (latenessDays > 0) {
        if (evaluation.score >= 5) {
          latenessBonus = latenessDays;
        } else if (evaluation.score >= 4) {
          latenessBonus = latenessDays / 2.0;
        } else {
          latenessBonus = latenessDays / 4.0;
        }
      }
      efactor = Math.max(
        1.3,
        previous.efactor + (0.1 - (5 - evaluation.score) * (0.08 + (5 - evaluation.score) * 0.02))
      );

      n = previous.n + 1;

      var workingEfactor = efactor;
      if (evaluation.score >= 3.0 && evaluation.score < 4) {
        // hard card. increase interval by 1.2 instead of whatever efactor was
        interval = Math.ceil(previous.interval * 1.2);

        // ding score since this was hard
        workingEfactor = Math.max(1.3, workingEfactor - 0.15);
      } else if (evaluation.score >= 5.0) {
        // easy card, so give bonus to workingEfactor
        workingEfactor = Math.max(1.3, workingEfactor + 0.15);
      }

      interval = Math.ceil((previous.interval + latenessBonus) * workingEfactor);

      // Compute amount of fuzz to apply to an interval to avoid bunching up reviews on the same cards.
      const fuzzForInterval = (i: number) => {
        var fuzzRange;
        if (i < 2) {
          fuzzRange = 0;
        } else if (i == 2) {
          fuzzRange = 1;
        } else if (i < 7) {
          fuzzRange = Math.round(i * 0.25);
        } else if (i < 30) {
          fuzzRange = Math.max(2, Math.round(i * 0.25));
        } else {
          fuzzRange = Math.max(4, Math.round(i * 0.05));
        }

        return Math.random() * fuzzRange - fuzzRange * 0.5;
      };

      // Add some proportional "fuzz" to interval to avoid bunching up reviews
      interval += fuzzForInterval(interval);
    }
  }

  return { n, efactor, interval };
};
