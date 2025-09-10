import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Linking 
} from "react-native";
import { getPlatoById } from "../service/api";

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const data = await getPlatoById(id);
        setMeal(data.meals[0]);
      } catch (err) {
        console.error("Error cargando plato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E76F51" />
      </View>
    );
  }

  if (!meal) return <Text>No se encontró el plato.</Text>;

  // extraer ingredientes
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push(`${meas} ${ing}`);
    }
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Imagen con card refinada */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      </View>

      {/* Título y categoría */}
      <Text style={styles.title}>{meal.strMeal}</Text>
      <Text style={styles.category}>{meal.strCategory} · {meal.strArea}</Text>

      {/* Ingredientes */}
      <Text style={styles.section}>Ingredientes</Text>
      <View style={styles.card}>
        {ingredients.map((ing, i) => (
          <Text key={i} style={styles.ingredient}>• {ing}</Text>
        ))}
      </View>

      {/* Instrucciones */}
      <Text style={styles.section}>Instrucciones</Text>
      <View style={styles.card}>
        <Text style={styles.instructions}>{meal.strInstructions}</Text>
      </View>

      {/* Link a YouTube */}
      {meal.strYoutube ? (
        <TouchableOpacity 
          style={styles.youtubeButton} 
          activeOpacity={0.85}
          onPress={() => Linking.openURL(meal.strYoutube)}
        >
          <Text style={styles.youtubeText}>📺 Ver Video en YouTube</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { padding: 20, paddingBottom: 50 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  imageWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  image: { width: "100%", height: 260 },

  title: { 
    fontSize: 26, 
    fontWeight: "700", 
    textAlign: "center", 
    marginTop: 10,
    marginBottom: 4,
    color: "#2B2B2B",
  },
  category: { 
    fontSize: 14, 
    color: "#6C757D", 
    textAlign: "center", 
    marginBottom: 24,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  section: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 10,
    marginTop: 10,
    color: "#3A3A3A"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ingredient: { 
    fontSize: 15, 
    color: "#333", 
    marginBottom: 6 
  },
  instructions: { 
    fontSize: 15, 
    lineHeight: 24, 
    color: "#444", 
    textAlign: "justify" 
  },

  youtubeButton: {
    backgroundColor: "#E76F51",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  youtubeText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
