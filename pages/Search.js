import React, { useState } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "../components/RecipeCard";
import { getPlatoByName } from "../service/api";
import { useRecipes } from "../service/RecipesContext";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [ids, setIds] = useState([]); // guardamos solo los ids de los resultados
  const { recipes, addRecipes, handleRate, handleToggleFavorite } = useRecipes();

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      const data = await getPlatoByName(text);
      if (data?.meals) {
        const mapped = data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          rating: 0,
          people: Math.floor(Math.random() * 5) + 1,
          time: `${Math.floor(Math.random() * 60) + 10} min`,
          favorite: false,
        }));

        // guardamos en contexto
        addRecipes(mapped);

        // en lugar de guardar recetas, guardamos solo ids
        setIds(mapped.map((m) => m.id));
      } else {
        setIds([]);
      }
    } else {
      setIds([]);
    }
  };

  // 🔥 ahora los resultados son siempre los objetos reales del contexto
  const searchResults = recipes.filter((r) => ids.includes(r.id));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TextInput
          placeholder="Buscar recetas..."
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
        />
        <ScrollView contentContainerStyle={styles.scroll}>
          {searchResults.length === 0 && query.length > 2 ? (
            <Text style={styles.noResults}>No se encontraron resultados</Text>
          ) : (
            searchResults.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                onRate={(newRating) => handleRate(recipe.id, newRating)}
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  scroll: { paddingBottom: 20 },
  noResults: { textAlign: "center", marginTop: 20, fontSize: 16 },
});