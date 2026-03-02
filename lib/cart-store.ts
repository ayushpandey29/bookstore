import { create } from "zustand"
import type { Book } from "./books"

export interface CartItem {
  book: Book
  quantity: number
}

interface CartStore {
  items: CartItem[]
  notification: { book: Book; addedAt: number } | null
  addItem: (book: Book) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  dismissNotification: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  notification: null,

  addItem: (book: Book) => {
    set((state) => {
      const existing = state.items.find((item) => item.book.id === book.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          notification: { book, addedAt: Date.now() },
        }
      }
      return {
        items: [...state.items, { book, quantity: 1 }],
        notification: { book, addedAt: Date.now() },
      }
    })
  },

  removeItem: (bookId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.book.id !== bookId),
    }))
  },

  updateQuantity: (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(bookId)
      return
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  dismissNotification: () => set({ notification: null }),

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    )
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
}))
