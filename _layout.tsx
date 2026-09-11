import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: "Product Details" }} />
        <Stack.Screen name="rfq" options={{ title: "Request for Quotation" }} />
        <Stack.Screen name="login" options={{ title: "Sign In", headerShown: false }} />
        <Stack.Screen name="register" options={{ title: "Create Account", headerShown: false }} />
      </Stack>
    </>
  );
}
