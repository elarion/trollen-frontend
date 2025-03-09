import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import createSecureStore from "redux-persist-expo-securestore";
import * as authModule from '../store/authSlice';
import authReducer from '../store/authSlice';
console.log(authModule);
// Création du stockage sécurisé
const SecureStore = createSecureStore();

const persistConfig = {
    key: 'trollen',
    storage: SecureStore, // Utilisation de SecureStore comme stockage sécurisé
    whitelist: ['auth'], // On persiste uniquement l'authentification
};

// Combinaison des reducers
const rootReducer = combineReducers({
    // persistReducer permet de persister le reducer, tout simplement
    auth: persistReducer(persistConfig, authReducer),
});

// Configuration du store Redux avec le reducer persisté
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Désactive les vérifications de sérialisation car SecureStore ne supporte pas les objets non sérialisables
            // un objet sérialisable est un objet qui peut être converti en une chaîne de caractères
        }),
});

// Création du persistor
const persistor = persistStore(store);

export { store, persistor };