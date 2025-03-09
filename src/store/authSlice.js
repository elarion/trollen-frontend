import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@utils/axiosInstance";
import * as SecureStore from "expo-secure-store";
// import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

// Fonction pour stocker l'utilisateur et les tokens de manière sécurisée
const storeUserData = async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
};

// Fonction pour supprimer les données utilisateur
const removeUserData = async () => {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
};

// Thunk pour l'inscription
export const preSignupUser = createAsyncThunk(
    "auth/preSignupUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/users/pre-signup`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.errors[0]?.msg || "Erreur d'inscription");
        }
    }
);
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/users/signup`, userData);
            const { user, accessToken, refreshToken } = response.data;
            await storeUserData(user, accessToken, refreshToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.errors[0]?.msg || "Registration error");
        }
    }
);

// Thunk pour la connexion
export const signinUser = createAsyncThunk(
    "auth/signinUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/users/signin`, userData);
            const { user, accessToken, refreshToken } = response.data;
            await storeUserData(user, accessToken, refreshToken);
            return response.data;
        } catch (error) {
            console.log("error =>", error.response.data.message);
            return rejectWithValue(error.response?.data?.message || "Connection error");
        }
    }
);

// Thunk pour la déconnexion
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            if (!refreshToken) return rejectWithValue("Aucun token trouvé");

            await axiosInstance.post(`/users/logout`, { refreshToken });
            await removeUserData();
            return true;
        } catch (error) {
            return rejectWithValue("Logout error");
        }
    }
);

// Thunk pour charger les données utilisateur au démarrage
export const loadUserData = createAsyncThunk(
    "auth/loadUserData",
    async (_, { rejectWithValue }) => {
        try {
            const user = await SecureStore.getItemAsync("user");
            const token = await SecureStore.getItemAsync("accessToken");

            if (user && token) return { user: JSON.parse(user), token };

            return rejectWithValue("No active session");
        } catch (error) {
            return rejectWithValue("Error while loading user data => ", error);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        updateAccessToken: (state, action) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder // builder est
            // Gestion de l'inscription préalablement à l'inscription
            .addCase(preSignupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(preSignupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(preSignupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Gestion de l'inscription
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.error = null;
                state.success = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })

            // Gestion de la connexion
            .addCase(signinUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.success = true;
            })
            .addCase(signinUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Gestion de la déconnexion
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.success = false;

                // Supprimer les données de SecureStore après déconnexion
                removeUserData();
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Chargement des données utilisateur
            .addCase(loadUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loadUserData.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.payload;
            });
    },
});

export const { resetState, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;