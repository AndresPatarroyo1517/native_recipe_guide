import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Users, Clock } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { playSound } from "../service/soundService";

export default function RecipeCard({
  title,
  image,
  rating,
  people,
  time,
  favorite,
  onRate,
  onToggleFavorite,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
                playSound("like");
              }}
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={22}
                color={favorite ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={(e) => {
                  e.stopPropagation();
                  onRate(star);
                  playSound("star");
                }}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={20}
                  color={star <= rating ? "#f5c518" : "gray"}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

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
  info: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 50,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
    marginTop: -4,
    marginRight: -4,
  },
  stars: { flexDirection: "row", marginTop: 8 },
  star: { marginRight: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  meta: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  metaText: { fontSize: 14 },
});