import { createStore } from "vuex";
import router from "@/router";

export default createStore({
  modules: {},
  state: {
    authenticated: false,
    user: null,
    initial: false,
    startUrl: "/",
    fakeUserData: {
      id: 1,
      name: "admin",
      email: "admin@mail.ru",
      avatar: null,
      avatar_id: null,
    },
  },
  getters: {
    avatarUrl(state) {
      if (state.user?.avatar) return state.user.avatar.full_url;
      return "/images/default_avatar.png";
    },
  },
  mutations: {
    updateAuthenticated(state, userData = null) {
      if (userData === null) {
        state.user = null;
        state.authenticated = false;
      } else {
        state.user = userData;
        state.authenticated = true;
      }
    },
    completeStartingInitialization(state) {
      state.initial = true;
    },
    setStartURL(state, value) {
      state.startUrl = value;
    },
  },
  actions: {
    startInit({ state, commit, dispatch }) {
      return new Promise((resolve) => {
        commit("setStartURL", new URL(window.location));
        setTimeout(() => {
          dispatch("startAuth").then(() => {
            commit("completeStartingInitialization");
            if (state.startUrl.pathname != "/loading")
              router.push(state.startUrl.pathname + state.startUrl.search);
            else router.push("/");
            resolve(true);
          });
        }, 2000);
      });
    },
    startAuth({ state, commit }) {
      return new Promise((resolve) => {
        // localStorage.setItem("tickers", JSON.stringify(state.tickerList));
        console.log("startAuth", localStorage.getItem("is_auth"));
        if (
          localStorage.getItem("is_auth") &&
          JSON.parse(localStorage.getItem("is_auth"))
        ) {
          commit("updateAuthenticated", state.fakeUserData);
        }
        resolve(true);
      });
    },
    login({ state, commit }) {
      return new Promise((resolve) => {
        commit("updateAuthenticated", state.fakeUserData);
        localStorage.setItem("is_auth", JSON.stringify(true));
        resolve(state.fakeUserData);
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("updateAuthenticated");
        localStorage.setItem("is_auth", JSON.stringify(false));
        console.log("router reload");
        router.go(router.path);
        resolve(true);
      });
    },
  },
});
