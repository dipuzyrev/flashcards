import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const humanizeDuration = (seconds: number) => {
  const diff = dayjs.duration(Number(seconds), "second");
  if (diff.asHours() < 1) {
    return `${Math.floor(diff.asMinutes())}m`;
  } else if (diff.asHours() < 24) {
    return `${Math.floor(diff.asHours())}h`;
  } else if (diff.asDays() < 30) {
    return `${Math.floor(diff.asDays())}d`;
  } else if (diff.asMonths() < 12) {
    return `${Math.round(diff.asMonths() * 10) / 10}M`;
  } else {
    return `${Math.round(diff.asYears() * 10) / 10}Y`;
  }
};
