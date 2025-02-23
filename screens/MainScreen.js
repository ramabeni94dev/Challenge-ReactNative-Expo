import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  Checkbox,
  ActivityIndicator,
  Dialog,
  Portal,
} from "react-native-paper";
import { getPageSpeedData } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory-native";
import { Picker } from "@react-native-picker/picker";

export default function MainScreen({ navigation }) {
  const [url, setUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [strategy, setStrategy] = useState("DESKTOP");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const availableCategories = [
    "PERFORMANCE",
    "ACCESSIBILITY",
    "BEST_PRACTICES",
    "PWA",
    "SEO",
  ];

  const preloadData = async () => {
    try {
      const categories = [
        { id: 1, name: "ACCESSIBILITY" },
        { id: 2, name: "BEST_PRACTICES" },
        { id: 3, name: "PERFORMANCE" },
        { id: 4, name: "PWA" },
        { id: 5, name: "SEO" },
      ];

      const strategies = [
        { id: 1, name: "DESKTOP" },
        { id: 2, name: "MOBILE" },
      ];

      const storedCategories = await AsyncStorage.getItem("categories");
      if (!storedCategories) {
        await AsyncStorage.setItem("categories", JSON.stringify(categories));
      }

      const storedStrategies = await AsyncStorage.getItem("strategies");
      if (!storedStrategies) {
        await AsyncStorage.setItem("strategies", JSON.stringify(strategies));
      }
    } catch (error) {
      console.error("Error al pre-cargar datos:", error);
    }
  };

  useEffect(() => {
    preloadData();
  }, []);

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      setMessage("Por favor ingresa una URL.");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrl(`https://${url}`);
    }

    if (selectedCategories.length === 0) {
      setMessage("Selecciona al menos una categoría de métricas.");
      return;
    }

    setLoadingAnalyze(true);

    try {
      setMessage("Analizando...");
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      const data = await getPageSpeedData(
        formattedUrl,
        selectedCategories,
        strategy
      );
      setAnalysisResult(data);
      setMessage("Análisis completado. Revisa las métricas debajo.");
    } catch (err) {
      console.error("Error llamando a la API de PageSpeed:", err);
      setMessage("Error al obtener datos de la API.");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleSaveMetrics = async () => {
    if (!analysisResult || !analysisResult.lighthouseResult) {
      setSnackbarMessage("No hay resultados de análisis para guardar.");
      setSnackbarError(true);
      setSnackbarVisible(true);
      return;
    }

    setLoadingSave(true);

    const { categories } = analysisResult.lighthouseResult;
    const performance = categories.performance?.score ?? null;
    const accessibility = categories.accessibility?.score ?? null;
    const bestPractices = categories["best-practices"]?.score ?? null;
    const pwa = categories.pwa?.score ?? null;
    const seo = categories.seo?.score ?? null;

    const performanceMetric =
      performance !== null ? Math.round(performance * 100) : null;
    const accessibilityMetric =
      accessibility !== null ? Math.round(accessibility * 100) : null;
    const bestPracticesMetric =
      bestPractices !== null ? Math.round(bestPractices * 100) : null;
    const pwaMetric = pwa !== null ? Math.round(pwa * 100) : null;
    const seoMetric = seo !== null ? Math.round(seo * 100) : null;

    const strategyId = strategy === "DESKTOP" ? 1 : 2;

    const metricsHistory =
      JSON.parse(await AsyncStorage.getItem("metricsHistory")) || [];

    const newMetric = {
      id: Date.now(),
      url,
      accessibility_metric: accessibilityMetric,
      pwa_metric: pwaMetric,
      performance_metric: performanceMetric,
      seo_metric: seoMetric,
      best_practices_metric: bestPracticesMetric,
      strategy_id: strategyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    metricsHistory.push(newMetric);

    try {
      await AsyncStorage.setItem(
        "metricsHistory",
        JSON.stringify(metricsHistory)
      );
      setSnackbarMessage("¡Métricas guardadas con éxito!");
      setSnackbarError(false);
    } catch (error) {
      setSnackbarMessage("Error al guardar métricas.");
      setSnackbarError(true);
    } finally {
      setSnackbarVisible(true);
      setLoadingSave(false);
    }
  };

  const handleClearSearch = () => {
    setUrl("");
    setSelectedCategories([]);
    setAnalysisResult(null);
    setMessage("");
    setSnackbarVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-end",
      }}
    >
      <Text style={styles.header}>Análisis de Sitios (Google PageSpeed)</Text>

      <TextInput
        label="URL"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />

      <Text style={styles.subHeader}>Selecciona Categorías de Métricas</Text>
      {availableCategories.map((cat) => (
        <View key={cat} style={styles.checkboxContainer}>
          <Checkbox
            status={selectedCategories.includes(cat) ? "checked" : "unchecked"}
            onPress={() => toggleCategory(cat)}
          />
          <Text>{cat}</Text>
        </View>
      ))}

      <Text style={styles.subHeader}>Estrategia</Text>
      <Picker
        selectedValue={strategy}
        onValueChange={(itemValue) => setStrategy(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="DESKTOP" value="DESKTOP" />
        <Picker.Item label="MOBILE" value="MOBILE" />
      </Picker>

      <Button
        mode="contained"
        onPress={handleAnalyze}
        style={styles.button}
        disabled={loadingAnalyze}
        icon="magnify"
      >
        {loadingAnalyze ? (
          <ActivityIndicator color="#fff" />
        ) : (
          "Ejecutar Análisis"
        )}
      </Button>

      {analysisResult &&
        analysisResult.lighthouseResult?.categories &&
        Object.entries(analysisResult.lighthouseResult.categories).map(
          ([key, cat], index) => (
            <Card key={`${key}-${index}`} style={styles.chartContainer}>
              <Card.Content>
                <Text style={styles.chartHeader}>
                  {cat.title}: {Math.round(cat.score * 100)}
                </Text>
                <VictoryChart
                  height={400}
                  width={350}
                  domainPadding={{ x: 50, y: [0, 10] }}
                >
                  <VictoryAxis
                    style={{
                      axis: { stroke: "#756f6a" },
                      tickLabels: { fontSize: 12, padding: 5 },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    tickValues={[0, 20, 40, 60, 80, 100]}
                    style={{
                      grid: { stroke: "#e6e6e6" },
                      tickLabels: { fontSize: 12, padding: 5 },
                    }}
                  />
                  <VictoryBar
                    data={[{ x: cat.title, y: Math.round(cat.score * 100) }]}
                    barWidth={40}
                    style={{
                      data: {
                        fill: "#4caf50",
                        stroke: "#388e3c",
                        strokeWidth: 2,
                      },
                    }}
                  />
                </VictoryChart>
              </Card.Content>
            </Card>
          )
        )}

      <Button
        mode="contained"
        onPress={handleSaveMetrics}
        style={styles.button}
        disabled={loadingSave}
        icon="content-save"
      >
        {loadingSave ? <ActivityIndicator color="#fff" /> : "Guardar Métricas"}
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate("History")}
        style={styles.button}
        labelStyle={styles.buttonText}
        icon="history"
      >
        Ver Historial
      </Button>

      <Button
        mode="outlined"
        onPress={handleClearSearch}
        style={styles.clearButton}
        labelStyle={styles.clearButtonText}
        icon="delete"
      >
        Limpiar Búsqueda
      </Button>

      <Portal>
        <Dialog
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
        >
          <Dialog.Title>{snackbarError ? "Error" : "Éxito"}</Dialog.Title>
          <Dialog.Content>
            <Text>{snackbarMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSnackbarVisible(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

    backgroundColor: "#CCD96C",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#D9D9D9",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    color: "#555",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  picker: {
    height: 50,
    marginVertical: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 50,
    backgroundColor: "#627324",
  },
  clearButton: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 50,
    backgroundColor: "#BA5B4F",
  },
  buttonText: {
    color: "#fcfcfc",
  },
  clearButtonText: {
    color: "#fcfcfc",
  },
  chartContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  chartHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1976D2",
  },
});
