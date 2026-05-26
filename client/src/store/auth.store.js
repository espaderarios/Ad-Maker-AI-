import { create } from 'zustand';
import { login as apiLogin, signup as apiSignup } from '../api/auth.api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiLogin(email, password);
      set({ user, token: token, isLoading: false });
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiSignup(email, password, name);
      set({ user, token: token, isLoading: false });
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
