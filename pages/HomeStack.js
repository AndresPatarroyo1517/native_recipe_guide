import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Home";
import DetailScreen from "./Detail"; 

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }} // el home sin header
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Detalle del Plato" }}
      />
    </Stack.Navigator>
  );
}
