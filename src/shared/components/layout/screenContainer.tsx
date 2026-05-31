import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: ReactNode;
};

/**
 * Shared screen wrapper that applies safe area handling consistently.
 */
export default function ScreenContainer({
  children,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      {children}
    </SafeAreaView>
  );
}
