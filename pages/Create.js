import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [people, setPeople] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [detalle, setDetalle] = useState("");

  const handleSubmit = () => {
    const newRecipe = {
      title,
      image,
      rating: parseInt(rating) || 0,
      people: parseInt(people) || 0,
      time,
      link,
      detalle,
    };

    console.log("Nueva receta:", newRecipe);

    // aquí podrías llamar a addRecipes(newRecipe) del contexto si lo deseas
    // luego regresar a Home
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Crear Nueva Receta</Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="URL de la Imagen"
          value={image}
          onChangeText={setImage}
        />
        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Número de personas"
          value={people}
          onChangeText={setPeople}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Tiempo (ej. 30 min)"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Link de referencia"
          value={link}
          onChangeText={setLink}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detalle de la receta"
          value={detalle}
          onChangeText={setDetalle}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar Receta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});