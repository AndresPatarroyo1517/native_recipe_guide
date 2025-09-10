import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecipes } from "../service/RecipesContext";
import RecipeCard from "../components/RecipeCard";

export default function FavoritesScreen() {
  const { recipes, handleRate, handleToggleFavorite } = useRecipes();
  const favorites = recipes.filter((r) => r.favorite);

  return (
    <SafeAreaView style={styles.safe}>
      {favorites.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.text}>
            Tus recetas favoritas aparecerán aquí ❤️
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
              onRate={(newRating) => handleRate(recipe.id, newRating)}
              onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
  scroll: { padding: 12 },
});