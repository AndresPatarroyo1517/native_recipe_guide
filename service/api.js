const API_URL = "https://www.themealdb.com/api/json/v1/1";

/**
Función para las peticiones a la API
@param {string} endpoint - El endpoint de la API (ej: "/platos")
@param {object} options - Opciones de fetch (method, headers, body)
*/
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en la solicitud a ${endpoint}:`, error.message);
    return null;
  }
}

// Obtener todos los platos (no funciona)
export async function getPlatos() {
  return await apiRequest("/platos");
}

// Obtener plato por ID
export async function getPlatoById(id) {
  return await apiRequest(`https://www.themealdb.com/lookup.php?i=${id}`);
}

// Obtener plato por nombre
export async function getPlatoByName(query) {
  return await apiRequest(`/search.php?s=${encodeURIComponent(query)}`);
}

// Obtener plato por primera letra
export async function getPlatosByFirstLetter(query) {
    return await apiRequest(`/search.php?f=${encodeURIComponent(query)}`)
}

// Obtener platos por categoria
export async function getPlatosByCategory(query) {
  return await apiRequest(`/filter.php?c=${encodeURIComponent(query)}`);
}

// Obtener categorias
export async function getCategories() {
  return await apiRequest(`/categories.php`);
}

// Obtener platos por ingrediente
export async function getPlatosByIngredient(query) {
  return await apiRequest(`/filter.php?i=${encodeURIComponent(query)}`);
}

// Obtener platos por categoria
export async function getPlatosByArea(query) {
  return await apiRequest(`/filter.php?a=${encodeURIComponent(query)}`);
}

// Obtener lista de categorias, area e ingredientes
// Valor del parametro para categoria: c
// Valor del parametro para area: a
// Valor del parametro para ingredientes: i
export async function getListByType(type) {
  return await apiRequest(`/list.php?${type}=list`);
}

// Obtener plato aleatorio
export async function getPlatoAleatorio() {
  return await apiRequest(`/random.php`);
}

// Obtener varios platos aleatorios
export async function getPlatosAleatorios(count = 10) {
  try {
    const requests = Array.from({ length: count }, () => getPlatoAleatorio());
    
    const results = await Promise.all(requests);

    const platos = results
      .map((res) => res?.meals?.[0])
      .filter(Boolean);

    const ids = new Set();
    const unicos = platos.filter((p) => {
      if (ids.has(p.idMeal)) return false;
      ids.add(p.idMeal);
      return true;
    });

    return unicos;
  } catch (error) {
    console.error("Error obteniendo platos aleatorios:", error);
    return [];
  }
}

// Obtener varios platos aleatorios (si o si hasta completar la cantidad de platos solicitada)
export async function getPlatosAleatoriosObligatorio(count = 5) {
  const ids = new Set();
  const platos = [];

  try {
    while (platos.length < count) {
      const faltan = count - platos.length;
      const requests = Array.from({ length: faltan }, () => getPlatoAleatorio());
      const results = await Promise.all(requests);

      results.forEach((res) => {
        const plato = res?.meals?.[0];
        if (plato && !ids.has(plato.idMeal)) {
          ids.add(plato.idMeal);
          platos.push(plato);
        }
      });

      if (platos.length + faltan > count && ids.size === platos.length) {
        console.warn("No se pudieron obtener suficientes platos únicos.");
        break;
      }
    }

    return platos;
  } catch (error) {
    console.error("Error obteniendo platos aleatorios:", error);
    return platos;
  }
}