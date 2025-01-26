export interface Recipe {
  id: string
  title: string
  image: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  servings: number
  category: string
  dietary: string[]
}

export interface RecipeFilters {
  category: string
  dietary: string[]
  search: string
}

