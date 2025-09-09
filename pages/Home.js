import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "../components/RecipeCard";
import { getCategories, getPlatosByFirstLetter, getPlatoById, getPlatoByName, getPlatosByCategory, getPlatoAleatorio, getPlatosAleatorios, getPlatosAleatoriosObligatorio, getListByType, getPlatosByIngredient, getPlatosByArea } from "../service/api";

export default function HomeScreen() {

  // Ejemplo para prueba de API (se puede borrar el useEffect)
  useEffect(() => {
    const fetchPlatos = async () => {
      const data = await getPlatosByArea("canadian");
      console.log(data)
    };
    fetchPlatos();
  }, []);

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
