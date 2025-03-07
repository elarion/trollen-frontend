import axios from "axios";
import * as SecureStore from "expo-secure-store";
// import { store } from "../redux/store";
// import { logout, updateAccessToken } from "../redux/authSlice";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({ baseURL: API_URL });

// Ajout du token Authorization à chaque requête
// axiosInstance.interceptors.request.use(
//     async (config) => {
//         const token = await SecureStore.getItemAsync("accessToken"); // 🔥 Récupération du token sécurisé
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Gestion des réponses et rafraîchissement du token si nécessaire
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Si le token est expiré (403 Unauthorized), on essaie de le rafraîchir
//         if (error.response?.status === 403 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const refreshToken = await SecureStore.getItemAsync("refreshToken");
//                 if (!refreshToken) throw new Error("Aucun refresh token trouvé");

//                 // Demande un nouveau accessToken
//                 const res = await axios.post(`${API_URL}/refresh`, { refreshToken });

//                 if (res.status === 200) {
//                     const newAccessToken = res.data.accessToken;

//                     // Mise à jour du Redux store & SecureStore
//                     store.dispatch(updateAccessToken(newAccessToken));
//                     await SecureStore.setItemAsync("accessToken", newAccessToken);

//                     // Rejoue la requête avec le nouveau token
//                     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                     return axiosInstance(originalRequest);
//                 }
//             } catch (refreshError) {
//                 // Si la tentative de refresh échoue, on déconnecte l'utilisateur
//                 store.dispatch(logout());
//                 await SecureStore.deleteItemAsync("accessToken");
//                 await SecureStore.deleteItemAsync("refreshToken");
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
