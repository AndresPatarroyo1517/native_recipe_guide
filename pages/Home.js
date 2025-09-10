import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "../components/RecipeCard";
import { useRecipes } from "../service/RecipesContext";
import { getPlatosAleatoriosObligatorio } from "../service/api";

export default function HomeScreen() {
  const {
    recipes,
    handleRate,
    handleToggleFavorite,
    addRecipes,
    loading,
    favoriteIds,
  } = useRecipes();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      // 🔥 1. Mantener los favoritos actuales
      const favorites = recipes.filter((r) =>
        favoriteIds.includes(r.id.toString())
      );

      // 2. Pedir 10 nuevos platos
      const platos = await getPlatosAleatoriosObligatorio(10);
      const mapped = platos.map((meal) => ({
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        rating: Math.floor(Math.random() * 5) + 1,
        people: Math.floor(Math.random() * 5) + 1,
        time: `${Math.floor(Math.random() * 60) + 10} min`,
        favorite: false,
      }));

      // 3. Reemplazar recetas en el contexto (favoritos + nuevas)
      addRecipes([...favorites, ...mapped]);
    } catch (error) {
      console.error("Error recargando recetas:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#ff6347" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RecipeCard
            {...item}
            onRate={(newRating) => handleRate(item.id, newRating)}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          refreshing ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#ff6347" />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  list: {
    padding: 12,
    paddingBottom: 80,
  },
  footer: {
    paddingVertical: 20,
  },
});
