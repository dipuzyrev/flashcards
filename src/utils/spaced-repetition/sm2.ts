import { SuperMemoEvaluation, SuperMemoItem } from "~/types/dictionary";

/**
 * This is the famous SM-2 algorithm from SuperMemo. It's simple enough to
 * implement and understand, so a good place to learn about how spaced
 * repetition algorithms work.
 *
 * See https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */
export const srsFunc = (previous: SuperMemoItem, evaluation: SuperMemoEvaluation) => {
  var n, efactor, interval;

  if (previous == null) {
    previous = { n: 0, efactor: 2.5, interval: 0.0 };
  }

  efactor = Math.max(
    1.3,
    previous.efactor + (0.1 - (5 - evaluation.score) * (0.08 + (5 - evaluation.score) * 0.02))
  );

  if (evaluation.score < 3) {
    n = 0;
    interval = 1;
  } else {
    n = previous.n + 1;

    if (previous.n == 0) {
      interval = 1;
    } else if (previous.n == 1) {
      interval = 6;
    } else {
      interval = Math.ceil(previous.interval * efactor);
    }
  }

  return { n, efactor, interval };
};
