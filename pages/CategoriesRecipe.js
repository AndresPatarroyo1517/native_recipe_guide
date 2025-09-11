import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "../components/RecipeCard";
import { getPlatosByCategory } from "../service/api";
import { useRecipes } from "../service/RecipesContext";

export default function CategoryRecipes({ route, navigation }) {
  const { categoryName, title } = route.params;
  const { handleRate, handleToggleFavorite } = useRecipes();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: title || categoryName,
    });
    fetchCategoryRecipes();
  }, [categoryName]);

  const fetchCategoryRecipes = async () => {
    try {
      setLoading(true);
      const response = await getPlatosByCategory(categoryName);
      setRecipes(response.meals || []);
    } catch (error) {
      console.error("Error fetching category recipes:", error);
      Alert.alert("Error", "No se pudieron cargar las recetas");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate("Home", {
      screen: "Detail",
      params: { 
        id: recipe.idMeal,
        recipe: recipe 
      }
    });
  };

  const renderRecipe = ({ item }) => (
    <RecipeCard
      title={item.strMeal}
      image={item.strMealThumb}
      rating={4}
      people="4 personas"
      time="30 min"
      favorite={false}
      onPress={() => handleRecipePress(item)}
      onToggleFavorite={() => handleToggleFavorite(item.idMeal)}
      onRate={(rating) => handleRate(item.idMeal, rating)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingText}>Cargando recetas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (recipes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No se encontraron recetas en esta categoría
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {recipes.length} recetas encontradas
        </Text>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
});