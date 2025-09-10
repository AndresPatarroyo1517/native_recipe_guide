import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // 👈 viene en Expo por defecto
import { RecipesProvider } from "./service/RecipesContext";

import HomeScreen from "./pages/Home";
import FavoritesScreen from "./pages/Favorites";
import SearchScreen from "./pages/Search";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <RecipesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // ocultar header arriba
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Search") {
                iconName = focused ? "search" : "search-outline";
              } else if (route.name === "Favorites") {
                iconName = focused ? "heart" : "heart-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#e91e63", // color activo (rosa)
            tabBarInactiveTintColor: "gray", // color inactivo
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </RecipesProvider>
  );
}


