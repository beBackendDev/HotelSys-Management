import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../api/auth.api";
import LocalStorage from "../constant/localStorage";
import { payloadCreator } from "../utils/helper";
import { safeJSONParse } from "../utils/storage";
import { jwtDecode } from "jwt-decode";




export const register = createAsyncThunk(
  "auth/register",
  payloadCreator(authApi.register)
);
export const login = createAsyncThunk(
  "auth/login",
  payloadCreator(authApi.login)
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const refreshToken =
        thunkAPI.getState().auth.profile.user?.refreshToken ||
        localStorage.getItem("refreshToken");

      const response = await authApi.logout(refreshToken);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerMember = createAsyncThunk(
  "auth/registerMember",
  payloadCreator(authApi.registerMember)
);
export const updateMe = createAsyncThunk(
  "auth/updateProfile",
  // "auth/update-profile",
  payloadCreator(authApi.updateProfile)
);
export const changePassword = createAsyncThunk(
  "auth/changePass",
  payloadCreator(authApi.changePass)
);




const handleAuthFulfilled = (state, action) => {
  const accessToken = action.payload.data.accessToken;
  const refreshToken = action.payload.data.refreshToken;
  const decoded = jwtDecode(accessToken);
  console.log(">>auth-slice-decoded: ", decoded);



  const userData = {
    userId: decoded.userId,
    username: decoded.sub,
    role: decoded.role,
    accessToken,
    refreshToken,
  };


  state.profile.user = userData;
  console.log("auth.slice userData: ", userData);
  localStorage.setItem(LocalStorage.user, JSON.stringify(userData));//khi cần kiểm tra thông tin: const user = JSON.parse(localStorage.getItem("user"));
  localStorage.setItem('accessToken', accessToken); 
  localStorage.setItem('refreshToken', refreshToken); 
};


const handleRegisterFulfilled = (state, action) => {
  state.profile.user = action.payload.data;
  localStorage.setItem(LocalStorage.user, JSON.stringify(action.payload.data));
};
const handleUnauth = (state) => {
  state.profile = {};
  localStorage.removeItem(LocalStorage.user);
  localStorage.removeItem(LocalStorage.role);
  localStorage.removeItem(LocalStorage.hotel);
  localStorage.removeItem(LocalStorage.accessToken);
  localStorage.removeItem(LocalStorage.refreshToken);
  localStorage.removeItem(LocalStorage.filters);
};


//
// const getLocalStorageItem = (key) => {
//   try {
//     const value = localStorage.getItem(key);
//     return value ? JSON.parse(value) : {};
//   } catch (e) {
//     console.warn(`Lỗi parse localStorage key = ${key}`, e);
//     return {};
//   }
// };  

const auth = createSlice({
  name: "auth",
  initialState: {
    profile: {
      hotel: safeJSONParse(LocalStorage.hotel),
      user: safeJSONParse(LocalStorage.user),
    }
  },
  reducers: {
    unauthorize: handleUnauth,
    setProfile: (state, action) => {
      state.profile.user = action.payload;
      localStorage.setItem(LocalStorage.user, JSON.stringify(action.payload));
    }
  },
  extraReducers: {
    [register.fulfilled]: handleRegisterFulfilled,
    [login.fulfilled]: handleAuthFulfilled,
    [logout.fulfilled]: handleUnauth,
    [registerMember.fulfilled]: (state, action) => {
      state.profile.hotel = action.payload.data;
      state.profile.user.roleId = 2;//chỉnh sửa
      localStorage.setItem(
        LocalStorage.user,
        JSON.stringify(state.profile.user)
      );
      localStorage.setItem(
        LocalStorage.hotel,
        JSON.stringify(state.profile.hotel)
      );
    },
    [updateMe.fulfilled]: (state, action) => {
      state.profile.user = action.payload.data;
      localStorage.setItem(
        LocalStorage.user,
        JSON.stringify(state.profile.user)
      );
    },
  },
});

const authReducer = auth.reducer;
export const { unauthorize, setProfile } = auth.actions;
export default authReducer;
