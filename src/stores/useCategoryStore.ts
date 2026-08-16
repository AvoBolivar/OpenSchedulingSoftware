import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '../definitions/category'
import { useAppointmentStore } from './useAppointmentStore'
import { type Result, ok, err } from '../lib/result'

type NewCategory = Omit<Category, 'id'>

interface CategoryState {
  categories: Category[]

  setCategories: (categories: Category[]) => void

  createCategory: (data: NewCategory) => void
  getCategory: (id: string) => Category | undefined
  updateCategory: (id: string, patch: Partial<NewCategory>) => void
  deleteCategory: (id: string) => Result<void>
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

      deleteCategory: (id) => {
        const isReferenced = useAppointmentStore
          .getState()
          .appointments.some((a) => a.categoryIDs.includes(id))
        if (isReferenced) {
          return err({
            kind: 'conflict',
            message: 'This category is still assigned to an appointment. Remove it from all appointments before deleting.',
          })
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
        return ok(undefined)
      },
    }),
    { name: 'categories' }
  )
)
