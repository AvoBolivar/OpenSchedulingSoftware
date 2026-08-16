import { describe, it, expect, beforeEach } from 'vitest'
import { useCategoryStore } from './useCategoryStore'
import { useAppointmentStore } from './useAppointmentStore'
import { resetStores } from '../testUtils/resetStores'
import { buildCategory, buildAppointment } from '../testUtils/builders'
import { ok, err } from '../lib/result'

describe('useCategoryStore', () => {
  beforeEach(() => resetStores())

  it('adds a category with a generated id on createCategory', () => {
    useCategoryStore.getState().createCategory(buildCategory({ name: 'Deep Clean' }))

    const categories = useCategoryStore.getState().categories
    expect(categories).toHaveLength(1)
    expect(categories[0].name).toBe('Deep Clean')
    expect(categories[0].id).toEqual(expect.any(String))
  })

  it('updates a category name on updateCategory', () => {
    const category = buildCategory({ name: 'Deep Clean' })
    useCategoryStore.setState({ categories: [category] })

    useCategoryStore.getState().updateCategory(category.id, { name: 'Standard Clean' })

    expect(useCategoryStore.getState().categories[0].name).toBe('Standard Clean')
  })

  it('removes a category on deleteCategory', () => {
    const category = buildCategory()
    useCategoryStore.setState({ categories: [category] })

    const result = useCategoryStore.getState().deleteCategory(category.id)

    expect(result).toEqual(ok(undefined))
    expect(useCategoryStore.getState().categories).toHaveLength(0)
  })

  it('returns conflict when deleting a category referenced by an appointment', () => {
    const category = buildCategory()
    useCategoryStore.setState({ categories: [category] })
    useAppointmentStore.getState().createAppointment(buildAppointment({ categoryIDs: [category.id] }))

    const result = useCategoryStore.getState().deleteCategory(category.id)

    expect(result).toEqual(err({ kind: 'conflict', message: expect.any(String) }))
    expect(useCategoryStore.getState().categories).toHaveLength(1) // nothing was deleted
  })

  it('does not leak state between tests', () => {
    expect(useCategoryStore.getState().categories).toHaveLength(0)
  })
})
