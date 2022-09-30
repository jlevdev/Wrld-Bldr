import axios from "axios";
import { AUTH_TOKEN_STORAGE } from "./Constants";

const baseURL = "http://127.0.0.1:8000/api/";

const AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem(AUTH_TOKEN_STORAGE)
      ? "JWT " + JSON.parse(localStorage.getItem(AUTH_TOKEN_STORAGE)).access
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
        "Looks like CORS might be the problem. " +
        "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = JSON.parse(localStorage.getItem(AUTH_TOKEN_STORAGE)).refresh;

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        console.log(tokenParts.exp);

        if (tokenParts.exp > now) {
          return AxiosInstance.post("/token/refresh/", {
            refresh: refreshToken,
          })
            .then((response) => {
              localStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify(response.data))

              AxiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return AxiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "/login/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/login/";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default AxiosInstance;
