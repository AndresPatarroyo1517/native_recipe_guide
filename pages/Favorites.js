import React from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";
import { useRecipes } from "../service/RecipesContext";
import RecipeCard from "../components/RecipeCard";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

export default function FavoritesScreen() {
  const { recipes, handleRate, handleToggleFavorite } = useRecipes();
  const favorites = recipes.filter((r) => r.favorite);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💖 Mis Favoritos</Text>
        <Text style={styles.subtitle}>
          Guarda tus recetas favoritas para verlas aquí
        </Text>
      </View>

      {/* Contenido */}
      {favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Heart size={56} color="#ccc" />
          <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
          <Text style={styles.emptyText}>
            Pulsa el ❤️ en una receta para guardarla aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }}>
              <RecipeCard
                {...item}
                onRate={(newRating) => handleRate(item.id, newRating)}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "Detail",
                    params: { id: item.id },
                  })
                }
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#333" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  list: { padding: 12, paddingBottom: 80 },
  row: { justifyContent: "space-between", marginBottom: 16 },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  emptyText: { fontSize: 14, color: "#666", marginTop: 4, textAlign: "center" },
});
