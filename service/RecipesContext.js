import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { getPlatosAleatoriosObligatorio } from "../service/api";
import { db } from "../config/firebaseConfig";

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]); // Recetas de Firestore
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial: recetas desde API, recetas personalizadas y favoritos desde Firebase
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

  // Escuchar cambios en tiempo real de las recetas personalizadas
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "recetas"),
      (snapshot) => {
        const customRecipesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: `custom_${doc.id}`, // Prefijo para diferenciar de API
            firestoreId: doc.id, // ID original de Firestore
            title: data.title,
            image: data.image || "https://via.placeholder.com/300",
            rating: data.rating || 0,
            people: data.people || 0,
            time: data.time || "N/A",
            link: data.link,
            detalle: data.detalle,
            ingredients: data.ingredients || [],
            favorite: false,
            isCustom: true, // Flag para identificar recetas personalizadas
            createdAt: data.createdAt,
          };
        });
        setCustomRecipes(customRecipesData);
      },
      (error) => {
        console.error("Error escuchando recetas personalizadas:", error);
      }
    );

    return () => unsubscribe();
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
        isCustom: false,
      }));
      setRecipes(mapped);
    } catch (err) {
      console.error("Error cargando recetas iniciales:", err);
    }
  };

  // Combinar recetas de API y personalizadas
  const allRecipes = [...customRecipes, ...recipes].map((recipe) => ({
    ...recipe,
    favorite: favoriteIds.includes(recipe.id.toString()),
  }));

  // Añadir recetas sin duplicados en estado local
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
    const idStr = id.toString();
    
    // Si es receta personalizada, actualizar customRecipes
    if (idStr.startsWith("custom_")) {
      setCustomRecipes((prev) =>
        prev.map((r) =>
          r.id.toString() === idStr ? { ...r, rating: newRating } : r
        )
      );
    } else {
      // Si es de API, actualizar recipes
      setRecipes((prev) =>
        prev.map((r) =>
          r.id.toString() === idStr ? { ...r, rating: newRating } : r
        )
      );
    }
  };

  // Toggle favorito
  const handleToggleFavorite = (id) => {
    const idStr = id.toString();

    setFavoriteIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((fid) => fid !== idStr)
        : [...prev, idStr]
    );
  };

  // NUEVA FUNCIÓN: Obtener receta por ID
  const getRecipeById = (id) => {
    const idStr = id.toString();
    return allRecipes.find((recipe) => recipe.id.toString() === idStr);
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes: allRecipes, // Devolvemos todas las recetas combinadas
        favoriteIds,
        addRecipes,
        handleRate,
        handleToggleFavorite,
        getRecipeById, // Nueva función exportada
        loading,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipesContext);