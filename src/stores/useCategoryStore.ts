import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '../definitions/category'

type NewCategory = Omit<Category, 'id'>

interface CategoryState {
  categories: Category[]

  setCategories: (categories: Category[]) => void

  createCategory: (data: NewCategory) => void
  getCategory: (id: string) => Category | undefined
  updateCategory: (id: string, patch: Partial<NewCategory>) => void
  deleteCategory: (id: string) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      setCategories: (categories) => set({ categories }),

      createCategory: (data) =>
        set((state) => ({
          categories: [...state.categories, { ...data, id: crypto.randomUUID() }],
        })),

      getCategory: (id) => get().categories.find((c) => c.id === id),

      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    { name: 'categories' }
  )
)
