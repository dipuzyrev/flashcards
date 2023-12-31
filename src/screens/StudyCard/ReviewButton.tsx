import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SuperMemoGrade } from "supermemo";
import { IFlashcard } from "~/types/dictionary";
import { humanizeDuration } from "~/utils/dates";
import { srsFunc } from "~/utils/srs/anki-like";
import { getLateness } from "~/utils/srs/lateness";

type ReviewButtonProps = {
  onPress: (grade: SuperMemoGrade) => void;
  level: "again" | "hard" | "good" | "easy";
  flashcard: IFlashcard;
};
const ReviewButton = ({ onPress, level, flashcard }: ReviewButtonProps) => {
  let grade: SuperMemoGrade, btnText, bgColor: string, textColor: string;

  switch (level) {
    case "again":
      grade = 2;
      btnText = "Again";
      textColor = "#EB4B51";
      break;
    case "hard":
      grade = 3;
      btnText = "Hard";
      textColor = "#F09135";
      break;
    case "good":
      grade = 4;
      btnText = "Good";
      textColor = "#6DC43A";
      break;

    default:
      grade = 5;
      btnText = "Easy";
      textColor = "#4090E9";
      break;
  }

  const intervalEvaluation = React.useMemo(() => {
    const { interval } = srsFunc(flashcard, { score: grade, lateness: getLateness(flashcard) });
    const seconds = Math.round(interval * 60 * 60 * 24);
    return seconds;
  }, [flashcard]);

  return (
    <Pressable
      onPress={() => onPress(grade)}
      style={({ pressed }) => {
        return [styles.reviewBtn, { borderColor: textColor }, { opacity: pressed ? 0.5 : 1 }];
      }}
    >
      <Text style={[styles.reviewBtnText, { color: textColor }]}>{btnText}</Text>
      <Text style={[styles.reviewBtnText, { color: textColor }]}>
        {humanizeDuration(intervalEvaluation)}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  reviewBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
  },
  reviewBtnText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },
});

export default ReviewButton;
