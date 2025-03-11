import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "../utils/axiosInstance"; // Pour rafraîchir le token si besoin
import socketIOClient from "socket.io-client";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

let socket = null;

// Fonction pour récupérer le token sécurisé
const getAccessToken = async () => {
    return await SecureStore.getItemAsync("accessToken");
};

// Fonction pour rafraîchir le token si nécessaire
const refreshToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("Aucun refresh token trouvé");

        const res = await axiosInstance.post(`${API_URL}/refresh`, { refreshToken });

        if (res.status === 200) {
            const newAccessToken = res.data.accessToken;
            await SecureStore.setItemAsync("accessToken", newAccessToken);
            return newAccessToken;
        }
    } catch (error) {
        console.error("Échec du rafraîchissement du token :", error);
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        return null;
    }
};

// Fonction pour se connecter à Socket.IO avec le token JWT
const connectSocket = async () => {
    let token = await getAccessToken();

    if (!token) {
        token = await refreshToken();
    }

    if (!token) {
        console.error("Impossible de se connecter à Socket.IO : Token manquant");
        return null;
    }

    // Déconnecter l'ancien socket s'il existe
    if (socket) {
        socket.disconnect();
        console.log("❌ Ancien socket déconnecté =>");
    }

    socket = io(API_URL, {
        auth: { token: `Bearer ${token}` },
        // transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("✅ Connecté au socket =>", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("❌ Déconnecté du socket");
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Erreur de connexion Socket.IO :", err.message);
    });

    return socket;
};

// Fonction pour récupérer l'instance actuelle du socket
const getSocket = () => socket;

export { connectSocket, getSocket };
