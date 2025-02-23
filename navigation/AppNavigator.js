import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../screens/MainScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#324001",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: "Análisis" }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Historial de Métricas" }}
      />
    </Stack.Navigator>
  );
}
