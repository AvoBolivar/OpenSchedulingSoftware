import { useState } from "react"
import { useCombobox } from "downshift"
import './autocomplete.css'

interface AutocompleteProps<T> {
  label: string
  placeholder: string
  items: T[]
  itemToString: (item: T | null) => string
  onSelectedItemChange: (item: T | null) => void
  selectedItem?: T | null
}

export default function Autocomplete<T>({
  label,
  placeholder,
  items,
  itemToString,
  onSelectedItemChange,
  selectedItem,
}: AutocompleteProps<T>) {
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    selectedItem: currentSelectedItem,
  } = useCombobox({
    items: filteredItems,
    itemToString,
    selectedItem: selectedItem ?? null,
    onInputValueChange: ({ inputValue }) => {
      const query = (inputValue ?? "").toLowerCase()
      setFilteredItems(
        items.filter((item) =>
          itemToString(item).toLowerCase().includes(query)
        )
      )
    },
    onSelectedItemChange: ({ selectedItem }) => {
      onSelectedItemChange(selectedItem ?? null)
    },
  })

  return (
    <div className="autocomplete-wrapper">
      <label className="autocomplete-label" {...getLabelProps()}>
        {label}
      </label>
      <div className="autocomplete-input-wrapper">
        <input
          className="autocomplete-input"
          placeholder={placeholder}
          {...getInputProps()}
        />
      </div>
      <ul
        className={`autocomplete-menu ${isOpen && filteredItems.length > 0 ? "open" : ""}`}
        {...getMenuProps()}
      >
        {isOpen &&
          filteredItems.map((item, index) => (
            <li
              key={index}
              className={`autocomplete-item ${
                highlightedIndex === index ? "highlighted" : ""
              } ${currentSelectedItem === item ? "selected" : ""}`}
              {...getItemProps({ item, index })}
            >
              {itemToString(item)}
            </li>
          ))}
      </ul>
    </div>
  )
}