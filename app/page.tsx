"use client"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeDetail } from "@/components/recipe-detail"
import type { Recipe, RecipeFilters } from "@/types/recipe"

// Map UI dietary labels to Edamam API health labels
const DIETARY_LABEL_MAP: Record<string, string> = {
  vegetarian: "vegetarian",
  vegan: "vegan",
  "gluten-free": "gluten-free",
  "dairy-free": "dairy-free",
  "low-carb": "low-carb",
  keto: "keto-friendly",
}

// Edamam API credentials
const API_ID = "a5de3521"
const API_KEY = "28f8a20bd893e2740e68d4bbb349b977"

export default function RecipePage() {
  // State management for recipes, favorites, selected recipe, error messages, filters, and loading status
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<RecipeFilters>({
    category: "all",
    dietary: [],
    search: "",
  })
  const [loading, setLoading] = useState(true)

  // Function to fetch recipes from the Edamam API
  const fetchRecipes = useCallback(
    async (searchTerm = "pizza") => {
      try {
        setLoading(true)
        setError(null)

        // Construct query parameters
        const params = new URLSearchParams({
          q: searchTerm,
          app_id: API_ID,
          app_key: API_KEY,
          from: "0",
          to: "50",
        })

        // Add dietary filters
        filters.dietary.forEach((diet) => {
          const apiLabel = DIETARY_LABEL_MAP[diet]
          if (apiLabel) {
            params.append("health", apiLabel)
          }
        })

        // Add meal type filter
        if (filters.category !== "all") {
          params.append("mealType", filters.category)
        }

        // Fetch data from API
        const response = await fetch(`https://api.edamam.com/search?${params.toString()}`)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }

        const data = await response.json()

        if (!data.hits || !Array.isArray(data.hits)) {
          throw new Error("Invalid API response format")
        }

        // Map API response to our Recipe type
        const mappedRecipes = data.hits.map((hit: any) => {
          const recipe = hit.recipe

          // Convert API health labels to our dietary format
          const dietaryLabels = recipe.healthLabels.map((label: string) => {
            const normalizedLabel = label.toLowerCase()
            return (
              Object.entries(DIETARY_LABEL_MAP).find(
                ([_, apiLabel]) => apiLabel.toLowerCase() === normalizedLabel,
              )?.[0] || normalizedLabel
            )
          })

          // Determine category based on meal type
          let category = recipe.mealType?.[0]?.toLowerCase() || "all"
          if (category === "lunch/dinner") {
            category = filters.category === "lunch" ? "lunch" : "dinner"
          }

          return {
            id: recipe.uri,
            title: recipe.label,
            image: recipe.image,
            description: recipe.healthLabels.join(", "),
            ingredients: recipe.ingredientLines,
            instructions: ["Instructions not available in API"],
            prepTime: recipe.totalTime || 30,
            servings: recipe.yield,
            category,
            dietary: dietaryLabels,
          }
        })

        setRecipes(mappedRecipes)
      } catch (error) {
        console.error("Error fetching recipes:", error)
        setError(error instanceof Error ? error.message : "An error occurred while fetching recipes")
        setRecipes([])
      } finally {
        setLoading(false)
      }
    },
    [filters.category, filters.dietary],
  )

  // Effect to load favorites from localStorage and fetch initial recipes
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    fetchRecipes()
  }, [fetchRecipes])

  // Effect to handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search) {
        fetchRecipes(filters.search)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search, fetchRecipes])

  // Function to toggle favorite status of a recipe
  const toggleFavorite = (recipe: Recipe) => {
    const newFavorites = favorites.includes(recipe.id)
      ? favorites.filter((id) => id !== recipe.id)
      : [...favorites, recipe.id]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  // Filter recipes based on category and dietary restrictions
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = filters.category === "all" || recipe.category === filters.category
    const matchesDietary =
      filters.dietary.length === 0 ||
      filters.dietary.every((diet) => {
        return recipe.dietary.some((recipeDiet) => recipeDiet.toLowerCase() === diet.toLowerCase())
      })

    return matchesCategory && matchesDietary
  })

  return (
    <Layout
      onSearch={(term) => setFilters((prev) => ({ ...prev, search: term }))}
      onCategoryChange={(category) => setFilters((prev) => ({ ...prev, category }))}
      onDietaryChange={(dietary) => setFilters((prev) => ({ ...prev, dietary }))}
      selectedDietary={filters.dietary}
    >
      {/* Display error message if there's an error */}
      {error && <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>}

      {loading ? (
        // Display loading skeleton while fetching recipes
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[300px] rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        // Display recipes or "No recipes found" message
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.id)}
                onFavoriteClick={toggleFavorite}
                onViewDetails={setSelectedRecipe}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No recipes found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      )}
      {/* Recipe detail modal */}
      <RecipeDetail recipe={selectedRecipe} open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </Layout>
  )
}

