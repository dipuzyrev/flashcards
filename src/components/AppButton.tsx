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
  const btnVariant = `btn${capitalize(variant)}`;
  const btnVariantRole = `btn${capitalize(variant)}${capitalize(role)}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => {
        return [
          // @ts-ignore
          styles[btnVariant],
          // @ts-ignore
          styles[btnVariantRole],
          { opacity: disabled ? 0.3 : pressed ? 0.5 : 1 },
          { alignSelf: width === "full" ? "stretch" : "center" },
        ];
      }}
    >
      <Text
        style={[
          styles.btnText,
          // @ts-ignore
          styles[btnVariantRole + "Text"],
          bold ? { fontWeight: "600" } : { fontWeight: "400" },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Solid
  btnSolid: {
    padding: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  btnSolidPrimary: {
    backgroundColor: "#007AFE",
  },
  btnSolidPrimaryText: {
    color: "#fff",
  },

  btnSolidSecondary: {
    backgroundColor: "#DFDFDF",
  },
  btnSolidSecondaryText: {
    color: "#222",
  },

  btnSolidDanger: {
    backgroundColor: "#FF3B30",
  },
  btnSolidDangerText: {
    color: "#fff",
  },

  // inline
  btnInline: {
    padding: 0,
    paddingVertical: 0,
  },
  btnInlinePrimary: {},
  btnInlinePrimaryText: {
    color: "#007AFE",
  },

  btnInlineSecondary: {},
  btnInlineSecondaryText: {
    color: "#222",
  },

  btnInlineDanger: {},
  btnInlineDangerText: {
    color: "#FF3B30",
  },

  btnText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
    display: "flex",
  },
});

export default AppButton;
