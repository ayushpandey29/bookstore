import { create } from "zustand"

export interface User {
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isHydrated: boolean
  login: (user: User) => void
  logout: () => void
  hydrate: () => void
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = sessionStorage.getItem("bookscart-user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isHydrated: false,

  login: (user: User) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bookscart-user", JSON.stringify(user))
    }
    set({ user })
  },

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("bookscart-user")
    }
    set({ user: null })
  },

  hydrate: () => {
    const user = getStoredUser()
    set({ user, isHydrated: true })
  },
}))
