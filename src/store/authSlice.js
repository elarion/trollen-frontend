import { createSlice } from "@reduxjs/toolkit";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@utils/axiosInstance";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const preSignUpUser = createAsyncThunk("auth/presignup", async (data, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.post("/users/pre-signup", data);
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }
// });

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        presignup: false,
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
        setUserPreSignup: (state, action) => {
            state.user = action.payload.user;
            state.presignup = action.payload.presignup;
        },
        setUserSignup: (state, action) => {
            console.log('in redux', action.payload.user, action.payload.presignup);
            state.user = action.payload.user;
            state.presignup = action.payload.presignup;
        },
        setUserSignin: (state, action) => {
            state.user = action.payload.user;
            state.presignup = action.payload.presignup;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
        },
        setUserName: (state, action) => {
            state.user.username = action.payload;
        },
        logout: (state) => {
            state.user = null;
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

});

// export const { resetState, updateAccessToken, setUserPreSignup, setUserSignin, setUser, logout } = authSlice.actions;
export const { setUserPreSignup, setUserSignin, setUser, setUserSignup, logout } = authSlice.actions;
export default authSlice.reducer;