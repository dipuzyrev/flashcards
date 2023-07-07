import dayjs, {duration} from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {Flashcard} from '~/types/dictionary';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getLateness = (flashcard: Flashcard) => {
  const dueDate = dayjs(flashcard.dueDate);
  const now = dayjs();
  const diffDays = now.diff(dueDate, 'seconds') / (60 * 60 * 24);

  if (diffDays <= 0 || flashcard.interval === 0) {
    return 0;
  }

  return diffDays / flashcard.interval;
};
