import axios from "axios";
import { EXPO_PUBLIC_API_KEY, EXPO_PUBLIC_API_URL } from "@env";

const API_KEY = `${EXPO_PUBLIC_API_KEY}`;
const API_URL = `${EXPO_PUBLIC_API_URL}`;

export const getPageSpeedData = async (url, selectedCategories, strategy) => {
  const categoryParams = selectedCategories
    .map((cat) => `&category=${cat}`)
    .join("");

  const endpoint = `${API_URL}?url=${encodeURIComponent(
    url
  )}&key=${API_KEY}${categoryParams}&strategy=${strategy}`;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "Error llamando a la API de PageSpeed:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};
