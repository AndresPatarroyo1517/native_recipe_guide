import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPlatosAleatoriosObligatorio } from "../service/api";

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]); // 👉 IDs con corazón
  const [loading, setLoading] = useState(true);

  // 👉 Cargar recetas y favoritos desde storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("recipes");
        const storedFavs = await AsyncStorage.getItem("favoriteIds");

        if (storedRecipes) setRecipes(JSON.parse(storedRecipes));
        else await fetchInitialRecipes();

        if (storedFavs) setFavoriteIds(JSON.parse(storedFavs));
      } catch (error) {
        console.error("Error cargando storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 👉 Guardar cambios en recipes
  useEffect(() => {
    if (recipes.length > 0) {
      AsyncStorage.setItem("recipes", JSON.stringify(recipes)).catch((err) =>
        console.error("Error guardando recetas:", err)
      );
    }
  }, [recipes]);

  // 👉 Guardar cambios en favoritos
  useEffect(() => {
    AsyncStorage.setItem("favoriteIds", JSON.stringify(favoriteIds)).catch(
      (err) => console.error("Error guardando favoritos:", err)
    );
  }, [favoriteIds]);

  // 🔹 Cargar recetas iniciales
  const fetchInitialRecipes = async () => {
    try {
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
      setRecipes(mapped);
    } catch (err) {
      console.error("Error cargando recetas iniciales:", err);
    }
  };

  // 🔹 Agregar recetas nuevas desde API o búsquedas
  const addRecipes = (newRecipes) => {
    setRecipes((prev) => {
      const existingIds = prev.map((r) => r.id.toString());
      const filtered = newRecipes.filter(
        (r) => !existingIds.includes(r.id.toString())
      );
      return [...prev, ...filtered];
    });
  };

  // 🔹 Calificar receta
  const handleRate = (id, newRating) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id.toString() === id.toString() ? { ...r, rating: newRating } : r
      )
    );
  };

  // 🔹 Favorito / quitar favorito
  const handleToggleFavorite = (id) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id.toString() === id.toString()
          ? { ...r, favorite: !r.favorite }
          : r
      )
    );

    setFavoriteIds((prev) =>
      prev.includes(id.toString())
        ? prev.filter((fid) => fid !== id.toString())
        : [...prev, id.toString()]
    );
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        favoriteIds,
        addRecipes,
        handleRate,
        handleToggleFavorite,
        loading,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipesContext);