import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "../components/RecipeCard";
import { useRecipes } from "../service/RecipesContext";

export default function HomeScreen() {
  const { recipes, handleRate, handleToggleFavorite } = useRecipes();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            {...recipe}
            onRate={(newRating) => handleRate(recipe.id, newRating)}
            onToggleFavorite={() => handleToggleFavorite(recipe.id)}
          />
        ))}
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