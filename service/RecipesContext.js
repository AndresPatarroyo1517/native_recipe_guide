import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getPlatosAleatoriosObligatorio } from "../service/api";
import { db } from "../config/firebaseConfig";

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial: recetas desde API, favoritos desde Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar recetas iniciales desde API
        await fetchInitialRecipes();

        // Cargar favoritos desde Firestore
        const favSnapshot = await getDoc(doc(db, "favs", "favIds"));
        if (favSnapshot.exists()) {
          setFavoriteIds(favSnapshot.data().ids || []);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Guardar favoritos en Firestore cuando cambian
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        const favRef = doc(db, "favs", "favIds");
        await setDoc(favRef, { ids: favoriteIds });
      } catch (err) {
        console.error("Error guardando favoritos:", err);
      }
    };

    // Guardar solo si ya cargó la lista inicial (para evitar guardar antes de cargar)
    if (!loading) {
      saveFavorites();
    }
  }, [favoriteIds, loading]);

  // Obtener recetas iniciales desde API externa
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

  // Añadir recetas sin duplicados en estado local (no guardamos en Firebase)
  const addRecipes = (newRecipes) => {
    setRecipes((prev) => {
      const existingIds = prev.map((r) => r.id.toString());
      const filtered = newRecipes.filter(
        (r) => !existingIds.includes(r.id.toString())
      );
      return [...prev, ...filtered];
    });
  };

  // Cambiar rating en estado local
  const handleRate = (id, newRating) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id.toString() === id.toString() ? { ...r, rating: newRating } : r
      )
    );
  };

  // Toggle favorito en estado local y actualizar favoritos en Firebase
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
