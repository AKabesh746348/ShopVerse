// This file manages the API URL connection string.
// It prioritizes the environment variable (for production) and falls back to localhost (for development).

export const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5001/api";
