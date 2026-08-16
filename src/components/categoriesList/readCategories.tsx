import type { Category } from "../../definitions/category"
import { useCategoryStore } from "../../stores/useCategoryStore"
import UpdateCategory from "./updateCategory"
import DeleteCategory from "./deleteCategory"

export default function ReadCategories() {
  const categories = useCategoryStore((s) => s.categories)

  if (categories.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-muted-foreground">
        <p className="m-0 mb-1 text-base font-bold text-primary">No categories yet</p>
        <p className="m-0 text-sm">
          Add your first category to see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {categories.map((category: Category) => (
        <div
          key={category.id}
          className="flex items-center justify-between gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <span className="flex-1 text-sm font-medium text-foreground">{category.name}</span>
          <div className="flex items-center gap-2">
            <UpdateCategory category={category} />
            <DeleteCategory categoryID={category.id} />
          </div>
        </div>
      ))}
    </div>
  )
}
