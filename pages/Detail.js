import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Linking } from "react-native";
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
        <ActivityIndicator size="large" color="#ff6347" />
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
    <ScrollView style={styles.container}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

      <Text style={styles.title}>{meal.strMeal}</Text>
      <Text style={styles.category}>{meal.strCategory} · {meal.strArea}</Text>

      <Text style={styles.section}>Ingredientes</Text>
      {ingredients.map((ing, i) => (
        <Text key={i} style={styles.text}>• {ing}</Text>
      ))}

      <Text style={styles.section}>Instrucciones</Text>
      <Text style={styles.text}>{meal.strInstructions}</Text>

      {meal.strYoutube ? (
        <Text
          style={[styles.section, { color: "blue" }]}
          onPress={() => Linking.openURL(meal.strYoutube)}
        >
          📺 Ver en YouTube
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  category: { fontSize: 16, color: "gray", marginBottom: 16 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 6 },
  text: { fontSize: 15, lineHeight: 22, marginBottom: 6 },
});