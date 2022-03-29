import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
  tokenExpirationDate: null,
  userId: null,
  userSocialNetworksTokens: {
    linkedInTokenExpirationDate: null,
    facebookTokenExpirationDate: null,
    allTokensValids: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const tokenExpirationDate =
        action.payload.tokenExpirationDate ||
        new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: action.payload.userId,
          token: action.payload.token,
          expiration: tokenExpirationDate,
          userSocialNetworksTokens: action.payload.userSocialNetworksTokens,
        })
      );
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.tokenExpirationDate = tokenExpirationDate;
      state.userId = action.payload.userId;
      state.userSocialNetworksTokens = action.payload.userSocialNetworksTokens;
    },
    logout(state) {
      localStorage.removeItem("userData");
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
      state.tokenExpirationDate = null;
      state.userSocialNetworksTokens = null;
    },
    setUserPermission(state, action) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      userData.userSocialNetworksTokens[action.payload.tokenField] =
        action.payload.tokenExpirationDate;
      userData.userSocialNetworksTokens.allTokensValids =
        action.payload.allTokensValids;
      localStorage.setItem("userData", JSON.stringify(userData));

      state.userSocialNetworksTokens[action.payload.tokenField] =
        action.payload.tokenExpirationDate;
      state.userSocialNetworksTokens.allTokensValids =
        action.payload.allTokensValids;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
