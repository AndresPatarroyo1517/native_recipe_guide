import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Trash2 } from "lucide-react-native";

export default function CreateScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [people, setPeople] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [detalle, setDetalle] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const handleSubmit = () => {
    const newRecipe = {
      title,
      image,
      rating: parseInt(rating) || 0,
      people: parseInt(people) || 0,
      time,
      link,
      detalle,
      ingredients: ingredients.filter((i) => i.trim() !== ""),
    };

    console.log("Nueva receta:", newRecipe);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Agregar Receta</Text>

          {/* Imagen */}
          <TouchableOpacity style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Plus size={40} color="#aaa" />
                <Text style={styles.imageText}>Agregar imagen</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Inputs principales */}
          <TextInput
            style={styles.input}
            placeholder="Nombre de la receta"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="URL de la imagen"
            placeholderTextColor="#999"
            value={image}
            onChangeText={setImage}
          />
          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            placeholderTextColor="#999"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Número de personas"
            placeholderTextColor="#999"
            value={people}
            onChangeText={setPeople}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Tiempo (ej. 30 min)"
            placeholderTextColor="#999"
            value={time}
            onChangeText={setTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Link de referencia (video)"
            placeholderTextColor="#999"
            value={link}
            onChangeText={setLink}
          />

          {/* Ingredientes dinámicos */}
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder={`Ingrediente ${index + 1}`}
                placeholderTextColor="#999"
                value={ingredient}
                onChangeText={(text) => handleIngredientChange(text, index)}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveIngredient(index)}
              >
                <Trash2 size={20} color="#ff4d6d" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Botón agregar ingrediente */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
            <Text style={styles.addButtonText}>+ Agregar Ingrediente</Text>
          </TouchableOpacity>

          {/* Área de instrucciones */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Instrucciones / Detalle de la receta"
            placeholderTextColor="#999"
            value={detalle}
            onChangeText={setDetalle}
            multiline
            numberOfLines={4}
          />

          {/* Botón guardar */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar Receta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40, // espacio extra para el último botón
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    marginTop: 8,
    color: "#888",
    fontSize: 14,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: "#ffe5ea",
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#e8e8e8",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
