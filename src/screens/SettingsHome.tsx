import { useTheme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SettingsStackParamList } from "~/types/navigation";

type Props = NativeStackScreenProps<SettingsStackParamList, "SettingsHome">;
const SettingsHome = ({ navigation }: Props) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Baked with ♥ by @dipuzyrev
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 16,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
});

export default SettingsHome;
