import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { googleSignIn } from '../firebase';

const registerUser = createAsyncThunk(
    'user/register',
    async (user, { rejectWithValue }) => {
        try {
            const result = await googleSignIn();
            return result;
        } catch (error) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue("could not registerUser : " + error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        guest: false,
        user: {},
        userToken: null,
        error: null,
        sucess: false,
        rememberMe: "false",
        hasNotification: false
    },
    reducers: {
        guestUserLoggedin: (state) => {
            state.guest = true
            state.sucess = true
        },
        guestUserLoggedOut: (state) => {
            state.guest = false
            state.sucess = false
        },
        userLoggedIn: (state, { payload }) => {
            state.guest = false
            state.sucess = true
            state.user = payload
        },
        userLoggedOut: (state) => {
            state.sucess = false
            state.guest = false
            state.user = {}
        },
        userLoggedInAndSetRememberMe: (state) => {
            state.rememberMe = "true"
        },
        userLoggedInAndNotSetRememberMe: (state) => {
            state.rememberMe = "false"
        }, 
        userLoggedInAndHasNotification: (state) => {
            state.hasNotification = true
        },
        userLoggedInAndNoNotification: (state) => {
            state.hasNotification = false
        }
    },
    extraReducers: {
        // register user
        [registerUser.pending]: (state) => {
            state.loading = true
            state.error = null
        },
        [registerUser.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.success = true // registration successful
            state.user = payload
        },
        [registerUser.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
    },
});
export const { guestUserLoggedin, guestUserLoggedOut, userLoggedIn, userLoggedOut, userLoggedInAndSetRememberMe, userLoggedInAndNotSetRememberMe, userLoggedInAndHasNotification, userLoggedInAndNoNotification } = userSlice.actions;

export default userSlice.reducer;
