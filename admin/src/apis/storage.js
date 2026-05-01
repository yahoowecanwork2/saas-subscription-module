// local sotrage manage
const USER_TOKEN_KEY = "token";

export const getToken = () => {
  try {
    return localStorage.getItem(USER_TOKEN_KEY);
  } catch (err) {
    console.error("Error reading token:", err);
    return null;
  }
};

// Save token
export const setToken = (token) => {
  try {
    localStorage.setItem(USER_TOKEN_KEY, token);
  } catch (err) {
    console.error("Error saving token:", err);
  }
};

// Remove token
export const clearToken = () => {
  try {
    localStorage.removeItem(USER_TOKEN_KEY);
  } catch (err) {
    console.error("Error clearing token:", err);
  }
};
