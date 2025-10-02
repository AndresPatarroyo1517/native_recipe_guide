import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import RecipeCard from "../components/RecipeCard";
import { getPlatoByName } from "../service/api";
import { useRecipes } from "../service/RecipesContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { addRecipes, handleRate, handleToggleFavorite, searchRecipes } = useRecipes();

  const handleSearch = async (text) => {
    setQuery(text);
    
    if (text.length > 2) {
      // 1. Buscar en recetas locales (API ya cargadas + Firestore)
      const localResults = searchRecipes(text);
      
      // 2. Buscar en la API externa
      try {
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
            isCustom: false,
          }));

          // Agregar al contexto sin duplicados
          addRecipes(mapped);
          
          // Combinar resultados locales con los de la API
          // Evitar duplicados comparando IDs
          const localIds = localResults.map(r => r.id.toString());
          const newApiResults = mapped.filter(
            m => !localIds.includes(m.id.toString())
          );
          
          setSearchResults([...localResults, ...newApiResults]);
        } else {
          // Solo resultados locales
          setSearchResults(localResults);
        }
      } catch (error) {
        console.error("Error buscando en API:", error);
        // En caso de error, mostrar solo resultados locales
        setSearchResults(localResults);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Buscar recetas..."
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => {
            setQuery("");
            setSearchResults([]);
          }}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchResults.length === 0 && query.length > 2 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.noResults}>😔 No se encontraron resultados</Text>
          <Text style={styles.suggestion}>
            Intenta con otro nombre o ingrediente
          </Text>
        </View>
      ) : query.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.hint}>🔍</Text>
          <Text style={styles.hintText}>Escribe para buscar recetas</Text>
          <Text style={styles.hintSubtext}>
            Busca por nombre o ingredientes
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    paddingHorizontal: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 6 },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  clear: { fontSize: 16, color: "#666", paddingHorizontal: 6 },
  list: { padding: 12, paddingBottom: 80 },
  row: { justifyContent: "space-between", marginBottom: 16 },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noResults: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 8, 
    color: "#333" 
  },
  suggestion: { 
    fontSize: 14, 
    color: "#666", 
    textAlign: "center" 
  },
  hint: {
    fontSize: 48,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  hintSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});