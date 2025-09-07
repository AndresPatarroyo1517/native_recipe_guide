import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomNavBar from "./components/BottomNavbar";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <SafeAreaProvider>
      <BottomNavBar />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}


