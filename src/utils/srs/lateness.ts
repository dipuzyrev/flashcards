import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { IFlashcard } from "~/types/dictionary";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getLateness = (flashcard: IFlashcard) => {
  const dueDate = dayjs(flashcard.dueDate);
  const now = dayjs();
  const diffDays = now.diff(dueDate, "seconds") / (60 * 60 * 24);

  if (diffDays <= 0 || flashcard.interval === 0) {
    return 0;
  }

  return diffDays / flashcard.interval;
};
