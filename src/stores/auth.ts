import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    setAuthStatus(status: boolean): void {
      this.isAuthenticated = status;
    },
  },
});