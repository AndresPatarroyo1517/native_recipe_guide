import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { getPlatosAleatoriosObligatorio } from "../service/api";
import { db } from "../config/firebaseConfig";

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]); 
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadData = async () => {
      try {
        
        await fetchInitialRecipes();

        
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

  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "recetas"),
      (snapshot) => {
        const customRecipesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: `custom_${doc.id}`, 
            firestoreId: doc.id, 
            title: data.title,
            image: data.image || "https://via.placeholder.com/300",
            rating: data.rating || 0,
            people: data.people || 0,
            time: data.time || "N/A",
            link: data.link,
            detalle: data.detalle,
            ingredients: data.ingredients || [],
            favorite: false,
            isCustom: true, 
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

 
  const allRecipes = [...customRecipes, ...recipes].map((recipe) => ({
    ...recipe,
    favorite: favoriteIds.includes(recipe.id.toString()),
  }));

 
  const addRecipes = (newRecipes) => {
    setRecipes((prev) => {
      const existingIds = prev.map((r) => r.id.toString());
      const filtered = newRecipes.filter(
        (r) => !existingIds.includes(r.id.toString())
      );
      return [...prev, ...filtered];
    });
  };

 
  const handleRate = (id, newRating) => {
    const idStr = id.toString();
    
    
    if (idStr.startsWith("custom_")) {
      setCustomRecipes((prev) =>
        prev.map((r) =>
          r.id.toString() === idStr ? { ...r, rating: newRating } : r
        )
      );
    } else {
     
      setRecipes((prev) =>
        prev.map((r) =>
          r.id.toString() === idStr ? { ...r, rating: newRating } : r
        )
      );
    }
  };

 
  const handleToggleFavorite = (id) => {
    const idStr = id.toString();

    setFavoriteIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((fid) => fid !== idStr)
        : [...prev, idStr]
    );
  };

  
  const getRecipeById = (id) => {
    const idStr = id.toString();
    return allRecipes.find((recipe) => recipe.id.toString() === idStr);
  };

  
  const searchRecipes = (query) => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    
    const customResults = customRecipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(searchTerm);
      const ingredientsMatch = recipe.ingredients?.some((ing) =>
        ing.toLowerCase().includes(searchTerm)
      );
      return titleMatch || ingredientsMatch;
    });

   
    const apiResults = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm)
    );

   
    return [...customResults, ...apiResults].map((recipe) => ({
      ...recipe,
      favorite: favoriteIds.includes(recipe.id.toString()),
    }));
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes: allRecipes, 
        favoriteIds,
        addRecipes,
        handleRate,
        handleToggleFavorite,
        getRecipeById,
        searchRecipes, 
        loading,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipesContext);