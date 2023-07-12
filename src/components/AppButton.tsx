import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "inline";
type ButtonWidth = "full" | "auto";
type Props = {
  variant?: ButtonVariant;
  width?: ButtonWidth;
  bold?: boolean;
  disabled?: boolean;
  onPress: () => void;
};
const AppButton = ({
  variant = "primary",
  width = "auto",
  disabled = false,
  bold = false,
  onPress,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => {
        return [
          styles.btn,
          variant === "primary"
            ? styles.btnPrimary
            : variant === "secondary"
            ? styles.btnSecondary
            : styles.btnGhost,
          { opacity: disabled ? 0.3 : pressed ? 0.5 : 1 },
          { alignSelf: width === "full" ? "stretch" : "center" },
        ];
      }}
    >
      <Text
        style={[
          styles.btnText,
          variant === "primary"
            ? styles.btnPrimaryText
            : variant === "secondary"
            ? styles.btnSecondaryText
            : styles.btnGhostText,
          bold ? { fontWeight: "600" } : {},
          disabled && variant === "inline" ? { color: "#111" } : {},
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  btnPrimary: {
    backgroundColor: "#222",
  },
  btnSecondary: {
    backgroundColor: "#DFDFDF",
  },
  btnGhost: {
    backgroundColor: "transparent",
    padding: 0,
    paddingVertical: 0,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
    display: "flex",
  },
  btnPrimaryText: {
    color: "#fff",
  },
  btnSecondaryText: {
    color: "#222",
  },
  btnGhostText: {
    color: "#007AFE",
    fontWeight: "400",
  },
});

export default AppButton;
