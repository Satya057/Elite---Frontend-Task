import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
  onSearch: (term: string) => void
  onCategoryChange: (category: string) => void
  onDietaryChange: (dietary: string[]) => void
  selectedDietary: string[]
}

const DIETARY_OPTIONS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "low-carb", "keto"]

export function Layout({ children, onSearch, onCategoryChange, onDietaryChange, selectedDietary }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <h1 className="text-2xl font-bold tracking-tight">Recipe App</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full max-w-lg flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search recipes..."
                className="w-full"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Select onValueChange={onCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="container pb-4 flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <Badge
              key={option}
              variant={selectedDietary.includes(option) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                if (selectedDietary.includes(option)) {
                  onDietaryChange(selectedDietary.filter((d) => d !== option))
                } else {
                  onDietaryChange([...selectedDietary, option])
                }
              }}
            >
              {option}
            </Badge>
          ))}
          {selectedDietary.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => onDietaryChange([])}>
              Clear filters
            </Button>
          )}
        </div>
      </header>
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
}

