import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Animated } from "react-native";
import { Card, Text, Button, List, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [animatedHeights, setAnimatedHeights] = useState({});

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("metricsHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.log("Error al cargar el historial:", error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar",
      "¿Deseas eliminar este registro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedHistory = history.filter((item) => item.id !== id);
              await AsyncStorage.setItem(
                "metricsHistory",
                JSON.stringify(updatedHistory)
              );
              setHistory(updatedHistory);
              setMessage("Registro eliminado.");
            } catch (error) {
              console.log("Error al eliminar registro:", error);
              setMessage("Error al eliminar el registro.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getStrategyName = (id) => {
    if (id === 1) return "DESKTOP";
    if (id === 2) return "MOBILE";
    return "Desconocida";
  };

  const toggleDetails = (id) => {
    const newExpandedItem = expandedItem === id ? null : id;
    setExpandedItem(newExpandedItem);

    if (newExpandedItem !== null) {
      const newHeights = { ...animatedHeights, [id]: new Animated.Value(0) };
      setAnimatedHeights(newHeights);
      Animated.timing(newHeights[id], {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeights[id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Historial de Métricas</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}

      {history.length === 0 && (
        <Text style={styles.noDataText}>No hay datos guardados.</Text>
      )}

      {history.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Registro #{item.id}</Text>
            <Text style={styles.cardSubtitle}>URL: {item.url}</Text>

            <Button
              mode="contained"
              onPress={() => toggleDetails(item.id)}
              style={styles.detailsButton}
            >
              Ver detalles
            </Button>
          </Card.Content>

          {expandedItem === item.id && (
            <Animated.View
              style={[
                styles.detailsContainer,
                {
                  height: animatedHeights[item.id]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 300],
                  }),
                },
              ]}
            >
              <List.Item
                title={`Performance: ${item.performance_metric ?? "-"}`}
              />
              <List.Item
                title={`Accessibility: ${item.accessibility_metric ?? "-"}`}
              />
              <List.Item
                title={`Best Practices: ${item.best_practices_metric ?? "-"}`}
              />
              <List.Item title={`SEO: ${item.seo_metric ?? "-"}`} />
              <List.Item title={`PWA: ${item.pwa_metric ?? "-"}`} />
              <List.Item
                title={`Strategy: ${getStrategyName(item.strategy_id)}`}
              />
              <List.Item title={`Fecha: ${item.created_at}`} />
            </Animated.View>
          )}

          <View style={styles.deleteButtonContainer}>
            <IconButton
              icon="delete"
              color="#D32F2F"
              size={28}
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#CCD96C",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#D9D9D9",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#333",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  detailsButton: {
    marginTop: 15,
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#324001",
  },
  detailsContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: "hidden",
  },
  deleteButtonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  message: {
    textAlign: "center",
    marginVertical: 8,
    color: "#1976D2",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
