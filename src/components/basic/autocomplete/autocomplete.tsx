import { useId, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "../../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Label } from "../../ui/label"
import { cn } from "../../../lib/utils"

interface AutocompleteProps<T> {
  label: string
  placeholder: string
  items: T[]
  itemToString: (item: T | null) => string
  onSelectedItemChange: (item: T | null) => void
  selectedItem?: T | null
}

function substringFilter(itemValue: string, search: string): number {
  return itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
}

export default function Autocomplete<T>({
  label,
  placeholder,
  items,
  itemToString,
  onSelectedItemChange,
  selectedItem,
}: AutocompleteProps<T>) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className={cn(!selectedItem && "text-muted-foreground")}>
              {selectedItem ? itemToString(selectedItem) : placeholder}
            </span>
            <ChevronsUpDown className="opacity-50" width={16} height={16} aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command filter={substringFilter}>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {items.map((item, index) => (
                  <CommandItem
                    key={index}
                    value={itemToString(item)}
                    onSelect={() => {
                      onSelectedItemChange(item)
                      setOpen(false)
                    }}
                  >
                    {itemToString(item)}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedItem === item ? "opacity-100" : "opacity-0"
                      )}
                      width={16}
                      height={16}
                      aria-hidden="true"
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
