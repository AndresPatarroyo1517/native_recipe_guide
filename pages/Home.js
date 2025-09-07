import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "../components/RecipeCard";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <RecipeCard
          title="Antipasti"
          image="https://i.imgur.com/VRm0iKd.jpg"
          rating={4}
          people={4}
          time="30 min"
        />
        <RecipeCard
          title="Pizza"
          image="https://i.imgur.com/OpGxN0D.jpg"
          rating={5}
          people={3}
          time="40 min"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scroll: {
    padding: 12,
  },
});
