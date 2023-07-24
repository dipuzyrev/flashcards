import { useTheme } from "@react-navigation/native";
import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { capitalize } from "~/utils/misc";

type ButtonVariant = "solid" | "inline";
type ButtonRole = "primary" | "secondary" | "danger";
type ButtonWidth = "full" | "auto";
type Props = {
  variant?: ButtonVariant;
  role?: ButtonRole;
  width?: ButtonWidth;
  bold?: boolean;
  disabled?: boolean;
  onPress: () => void;
};
const AppButton = ({
  variant = "solid",
  role = "primary",
  width = "auto",
  disabled = false,
  bold = false,
  onPress,
  children,
}: React.PropsWithChildren<Props>) => {
  const { colors } = useTheme();

  const btnVariant = `btn${capitalize(variant)}`;

  const [pressed, setPressed] = React.useState(false);

  // @ts-ignore
  let defaultStyle, pressedStyle, defaultTextStyle, pressedTextStyle;

  switch (variant) {
    case "solid":
      switch (role) {
        case "primary":
          defaultStyle = { backgroundColor: colors.primaryDefault };
          pressedStyle = { backgroundColor: colors.primaryPressed };
          defaultTextStyle = { color: colors.primaryDefaultText };
          pressedTextStyle = { color: colors.primaryPressedText };
          break;
        case "secondary":
          defaultStyle = { backgroundColor: colors.secondaryDefault };
          pressedStyle = { backgroundColor: colors.secondaryPressed };
          defaultTextStyle = { color: colors.secondaryDefaultText };
          pressedTextStyle = { color: colors.secondaryPressedText };
          break;
        case "danger":
          defaultStyle = { backgroundColor: colors.dangerDefault };
          pressedStyle = { backgroundColor: colors.dangerPressed };
          defaultTextStyle = { color: colors.dangerDefaultText };
          pressedTextStyle = { color: colors.dangerPressedText };
          break;
      }
      break;
    case "inline":
      defaultStyle = { backgroundColor: "transparent" };
      pressedStyle = { backgroundColor: "transparent" };
      switch (role) {
        case "primary":
          defaultTextStyle = { color: colors.primaryDefault };
          pressedTextStyle = { color: colors.primaryDefault, opacity: 0.5 };
          break;
        case "secondary":
          defaultTextStyle = { color: colors.text };
          pressedTextStyle = { color: colors.text, opacity: 0.5 };
          break;
        case "danger":
          defaultTextStyle = { color: colors.dangerDefault };
          pressedTextStyle = { color: colors.dangerDefault, opacity: 0.5 };
          break;
      }
      break;
  }

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPress={onPress}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
        // @ts-ignore
        styles[btnVariant],
        defaultStyle,
        pressed ? pressedStyle : {},
        { opacity: disabled ? 0.3 : 1 },
        { alignSelf: width === "full" ? "stretch" : "center" },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          bold ? { fontWeight: "600" } : { fontWeight: "400" },
          defaultTextStyle,
          pressed ? pressedTextStyle : {},
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnSolid: {
    padding: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  btnInline: {
    padding: 0,
    paddingVertical: 0,
  },

  btnText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
    display: "flex",
  },
});

export default AppButton;
