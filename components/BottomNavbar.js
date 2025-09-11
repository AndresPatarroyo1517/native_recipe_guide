import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home as HomeIcon, Heart, Search as SearchIcon, ListCheck } from "lucide-react-native";
import HomeScreen from "../pages/Home";
import FavoritesScreen from "../pages/Favorites";
import SearchScreen from "../pages/Search";
import Categories from '../pages/Categories';

const Tab = createBottomTabNavigator();

function TabIcon({ route, focused, color, size }) {
  let Icon = HomeIcon;
  if (route.name === "Home") Icon = HomeIcon;
  if (route.name === "Favorites") Icon = Heart;
  if (route.name === "Search") Icon = SearchIcon;
  if (route.name === "Categories") Icon = ListCheck;
  return <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
}

export default function BottomNavBar() {
  const insets = useSafeAreaInsets();

  const theme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "white" },
  };

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) =>
            <TabIcon route={route} focused={focused} color={color} size={size} />,
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          tabBarHideOnKeyboard: true,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 56 + insets.bottom,
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ],
          tabBarBackground: () => <View style={styles.tabBg} />,
          tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.7} />,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Categories" component={Categories} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e5e5",
    backgroundColor: "white",
  },
  tabBg: { flex: 1, backgroundColor: "white" },
});
