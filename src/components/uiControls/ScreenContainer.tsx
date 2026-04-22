import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  return (
    // Setting edges to allow header to use full width and avoid extra padding on top
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      {children}
    </SafeAreaView>
  );
}