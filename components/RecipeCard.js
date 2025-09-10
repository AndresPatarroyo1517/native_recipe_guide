import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Users, Clock } from "lucide-react-native";
import { AntDesign } from "@expo/vector-icons";

export default function RecipeCard({
  title,
  image,
  rating,
  people,
  time,
  favorite,
  onRate,
  onToggleFavorite,
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.info}>
        {/* fila superior: título + corazón */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onToggleFavorite}>
            <AntDesign
              name={favorite ? "heart" : "hearto"}
              size={22}
              color={favorite ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>

        {/* fila intermedia: estrellas */}
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => onRate(star)}>
              <AntDesign
                name={star <= rating ? "star" : "staro"}
                size={20}
                color={star <= rating ? "#f5c518" : "gray"}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* fila inferior: personas + tiempo */}
        <View style={styles.row}>
          <View style={styles.meta}>
            <Users size={16} />
            <Text style={styles.metaText}> {people}</Text>
          </View>

          <View style={styles.meta}>
            <Clock size={16} />
            <Text style={styles.metaText}> {time}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  image: { width: "100%", height: 160 },
  info: { padding: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  stars: { flexDirection: "row", marginTop: 6 },
  star: { marginRight: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  meta: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  metaText: { fontSize: 14 },
});