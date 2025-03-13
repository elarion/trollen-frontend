import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { store } from "../configs/redux";
import { logout } from "../store/authSlice";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({ baseURL: API_URL, timeout: 10000, headers: { "Content-Type": "application/json" } });

// Ajout du token Authorization à chaque requête
axiosInstance.interceptors.request.use(
    async (config) => {

        const token = await SecureStore.getItemAsync("accessToken"); // Récupération du token sécurisé

        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => Promise.reject(error)
);

// // Gestion des réponses et rafraîchissement du token si nécessaire
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) throw new Error("Aucun refresh token trouvé");

                // Demande un nouveau token
                const res = await axios.patch(`${API_URL}/users/refresh`, { refreshToken });

                if (res.status === 200) {
                    const newAccessToken = res.data.accessToken;

                    // Mise à jour directement dans SecureStore
                    await SecureStore.setItemAsync("accessToken", newAccessToken);

                    // Réessaye la requête avec le nouveau token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                Alert.alert("Session expired", "please login again");
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                store.dispatch(logout());
            }
        }

        // Promise.reject(error) permet de propager l'erreur à la fonction appelante
        return Promise.reject(error);
    }
);

export default axiosInstance;
