import axios from "axios";
import { parseApiError } from "@/lib/errors.js";

axios.defaults.baseURL = "http://todo.back";
axios.defaults.headers.common["Accept"] = "application/json";

const sourceUrls = {
  login: "/api/login",
  logout: "/api/logout",
  user: "/api/user",
  register: "/api/register",
  nameIsFree: "/api/name-is-free",
  emailIsFree: "/api/email-is-free",
};

let token = localStorage.getItem("token") ?? null;

const api = {
  login: (auth) =>
    new Promise((resolve, reject) => {
      // console.log("api->login", auth);
      axios
        .post(sourceUrls.login, auth)
        .then(({ data }) => {
          if (data.access_token) {
            if (data.user) {
              token = "Bearer " + data.access_token;
              localStorage.setItem("token", token);
              axios.defaults.headers.common["Authorization"] = token;
              resolve(data.user);
            } else {
              reject("ERROR: user data wasn't received");
            }
          } else {
            reject("ERROR: auth token wasn't received");
          }
        })
        .catch((err) => {
          reject(parseApiError(err));
        });
    }),
  logout: () =>
    new Promise((resolve, reject) => {
      // console.log("api->logout");
      axios
        .get(sourceUrls.logout)
        .then(() => {
          // console.log("api->logout completed successfully");
          token = null;
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          resolve(true);
        })
        .catch((err) => {
          reject(parseApiError(err));
        });
    }),
  checkAuth: () =>
    new Promise((resolve, reject) => {
      if (!token) reject("no auth Token");
      else {
        // console.log("token is:", token);
        axios.defaults.headers.common["Authorization"] = token;

        axios
          .get(sourceUrls.user)
          .then(({ data }) => {
            // console.log("api->checkAuth", data);
            resolve(data);
          })
          .catch((err) => {
            token = null;
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            reject("ERROR: " + parseApiError(err));
          });
      }
    }),
  register: (regData) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.register, regData)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject("ERROR: " + parseApiError(err));
        });
    }),
  nameIsFree: (name) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.nameIsFree, { name })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          const message = parseApiError(err);
          reject(message);
        });
    }),
  emailIsFree: (email) =>
    new Promise((resolve, reject) => {
      axios
        .post(sourceUrls.emailIsFree, { email })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          let message = parseApiError(err);
          reject(message);
        });
    }),
};

export default api;
