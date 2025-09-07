import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Users, Clock } from "lucide-react-native";

export default function RecipeCard({ title, image, rating, people, time }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.row}>
          <Text style={styles.rating}>{"⭐".repeat(rating)}</Text>

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
    </TouchableOpacity>
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
  title: { fontSize: 18, fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  rating: { marginRight: 8 },
  meta: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  metaText: { fontSize: 14 },
});
