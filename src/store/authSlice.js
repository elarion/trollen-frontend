// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@utils/axiosInstance";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

// // Fonction pour stocker l'utilisateur et les tokens de manière sécurisée
// const storeUserData = async (user, accessToken, refreshToken) => {
//     await SecureStore.setItemAsync("user", JSON.stringify(user));
//     await SecureStore.setItemAsync("accessToken", accessToken);
//     await SecureStore.setItemAsync("refreshToken", refreshToken);
// };

// // Fonction pour supprimer les données utilisateur
// const removeUserData = async () => {
//     await SecureStore.deleteItemAsync("user");
//     await SecureStore.deleteItemAsync("accessToken");
//     await SecureStore.deleteItemAsync("refreshToken");
// };

// // Thunk pour l'inscription
// export const preSignupUser = createAsyncThunk(
//     "auth/preSignupUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/users/pre-signup`, userData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.errors[0]?.msg || "Erreur d'inscription");
//         }
//     }
// );
// export const signupUser = createAsyncThunk(
//     "auth/signupUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/users/signup`, userData);
//             const { user, accessToken, refreshToken } = response.data;
//             await storeUserData(user, accessToken, refreshToken);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.errors[0]?.msg || "Registration error");
//         }
//     }
// );

// // Thunk pour la connexion
// export const signinUser = createAsyncThunk(
//     "auth/signinUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/users/signin`, userData);
//             const { user, accessToken, refreshToken } = response.data;
//             await storeUserData(user, accessToken, refreshToken);
//             return response.data;
//         } catch (error) {
//             console.log("error =>", error.response.data.message);
//             return rejectWithValue(error.response?.data?.message || "Connection error");
//         }
//     }
// );

// // Thunk pour la déconnexion
// export const logoutUser = createAsyncThunk(
//     "auth/logoutUser",
//     async (_, { rejectWithValue }) => {
//         try {
//             const refreshToken = await SecureStore.getItemAsync("refreshToken");
//             if (!refreshToken) return rejectWithValue("Aucun token trouvé");

//             await axiosInstance.post(`/users/logout`, { refreshToken });
//             await removeUserData();
//             return true;
//         } catch (error) {
//             return rejectWithValue("Logout error");
//         }
//     }
// );

// // Thunk pour charger les données utilisateur au démarrage
// export const loadUserData = createAsyncThunk(
//     "auth/loadUserData",
//     async (_, { rejectWithValue }) => {
//         try {
//             const user = await SecureStore.getItemAsync("user");
//             const token = await SecureStore.getItemAsync("accessToken");

//             if (user && token) return { user: JSON.parse(user), token };

//             return rejectWithValue("No active session");
//         } catch (error) {
//             return rejectWithValue("Error while loading user data => ", error);
//         }
//     }
// );

// const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//         user: null,
//         token: null,
//         loading: false,
//         error: null,
//         success: false,
//     },
//     reducers: {
//         resetState: (state) => {
//             state.loading = false;
//             state.error = null;
//             state.success = false;
//         },
//         updateAccessToken: (state, action) => {
//             state.token = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder // builder est
//             // Gestion de l'inscription préalablement à l'inscription
//             .addCase(preSignupUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(preSignupUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.error = null;
//             })
//             .addCase(preSignupUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // Gestion de l'inscription
//             .addCase(signupUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(signupUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.accessToken;
//                 state.error = null;
//                 state.success = true;
//             })
//             .addCase(signupUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;

//             })

//             // Gestion de la connexion
//             .addCase(signinUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(signinUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.accessToken;
//                 state.success = true;
//             })
//             .addCase(signinUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // Gestion de la déconnexion
//             .addCase(logoutUser.fulfilled, (state) => {
//                 state.user = null;
//                 state.token = null;
//                 state.success = false;

//                 // Supprimer les données de SecureStore après déconnexion
//                 removeUserData();
//             })
//             .addCase(logoutUser.rejected, (state, action) => {
//                 state.error = action.payload;
//             })

//             // Chargement des données utilisateur
//             .addCase(loadUserData.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loadUserData.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 state.error = null;
//             })
//             .addCase(loadUserData.rejected, (state, action) => {
//                 state.loading = false;
//                 // state.error = action.payload;
//             });
//     },
// });

// export const { resetState, updateAccessToken } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@utils/axiosInstance";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fonction pour stocker les tokens en SecureStore
const storeTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
};

// Fonction pour récupérer le token de SecureStore
const getToken = async () => {
    return await SecureStore.getItemAsync("accessToken");
};

// Fonction pour supprimer les tokens
const removeTokens = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
};

// // preSignupUser : Pré-inscription
// export const preSignupUser = createAsyncThunk(
//     "auth/preSignupUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/users/pre-signup`, userData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.errors[0]?.msg || "Erreur d'inscription");
//         }
//     }
// );

// // signupUser : Inscription complète
// export const signupUser = createAsyncThunk(
//     "auth/signupUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/users/signup`, userData);
//             const { user, accessToken, refreshToken } = response.data;

//             await storeTokens(accessToken, refreshToken);
//             await AsyncStorage.setItem("user", JSON.stringify(user)); // Sauvegarde en AsyncStorage

//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.errors[0]?.msg || "Registration error");
//         }
//     }
// );

// // 🔥 `signinUser` : Connexion
// export const signinUser = createAsyncThunk(
//     "auth/signinUser",
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.post(`/users/signin`, userData);
//             const { user, accessToken, refreshToken } = response.data;

//             await storeTokens(accessToken, refreshToken);
//             await AsyncStorage.setItem("user", JSON.stringify(user)); // Sauvegarde en AsyncStorage

//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "Connection error");
//         }
//     }
// );

// export const logoutUser = createAsyncThunk(
//     "auth/logoutUser",
//     async (_, { rejectWithValue }) => {
//         try {
//             const refreshToken = await SecureStore.getItemAsync("refreshToken");
//             if (!refreshToken) return rejectWithValue("Aucun token trouvé");

//             await axiosInstance.post(`/users/logout`, { refreshToken });

//             console.log('In logoutUser after post=>', refreshToken);

//             await removeTokens(); // Supprime les tokens
//             await AsyncStorage.removeItem("user"); // Supprime les infos utilisateur

//             return true;
//         } catch (error) {
//             return rejectWithValue("Logout error");
//         }
//     }
// );

// export const loadUserData = createAsyncThunk(
//     "auth/loadUserData",
//     async (_, { rejectWithValue }) => {
//         try {
//             const user = await AsyncStorage.getItem("user");
//             const token = await getToken();

//             console.log('In reduxer =>', user);

//             if (user && token) return { user: JSON.parse(user), token };
//             // return rejectWithValue("No active session");
//             return false;
//         } catch (error) {
//             return rejectWithValue("Error while loading user data");
//         }
//     }
// );

// 🔥 Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
        success: false,
        successSignup: false,
        modalSignInVisible: false,
        modalSignUpVisible: false,
    },
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.successSignup = false;
        },
        updateAccessToken: (state, action) => {
            state.token = action.payload;
        },
        setUserPreSignup: (state, action) => {
            state.user = action.payload.user;
        },
        setUserSignin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setUserSignup: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        },
    },
    // extraReducers: (builder) => {
    //     builder // builder est
    //         // Gestion de l'inscription préalablement à l'inscription
    //         .addCase(preSignupUser.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(preSignupUser.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.user = action.payload.user;
    //             state.successSignup = true;
    //             state.error = null;
    //         })
    //         .addCase(preSignupUser.rejected, (state, action) => {
    //             state.successSignup = false;
    //             state.loading = false;
    //             state.error = action.payload;
    //         })

    //         // Gestion de l'inscription
    //         .addCase(signupUser.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(signupUser.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.user = action.payload.user;
    //             state.token = action.payload.accessToken;
    //             state.error = null;
    //             state.success = true;
    //         })
    //         .addCase(signupUser.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.payload;

    //         })

    //         // Gestion de la connexion
    //         .addCase(signinUser.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(signinUser.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.user = action.payload.user;
    //             state.token = action.payload.accessToken;
    //             state.success = true;
    //         })
    //         .addCase(signinUser.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.payload;
    //         })

    //         // Gestion de la déconnexion
    //         .addCase(logoutUser.fulfilled, (state) => {
    //             state.user = null;
    //             state.token = null;
    //             state.success = false;
    //         })
    //         .addCase(logoutUser.rejected, (state, action) => {
    //             state.error = action.payload;
    //         })

    //         // Chargement des données utilisateur
    //         .addCase(loadUserData.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(loadUserData.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.user = action.payload.user;
    //             state.token = action.payload.token;
    //             state.error = null;
    //         })
    //         .addCase(loadUserData.rejected, (state, action) => {
    //             state.loading = false;
    //             // state.error = action.payload;
    //         });
    // },
});

// export const { resetState, updateAccessToken, setUserPreSignup, setUserSignin, setUser, logout } = authSlice.actions;
export const { setUserPreSignup, setUserSignin, setUserSignup, setUser, logout } = authSlice.actions;
export default authSlice.reducer;