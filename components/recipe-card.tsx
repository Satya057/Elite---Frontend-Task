import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Recipe } from "../types/recipe"
import Image from "next/image"

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onFavoriteClick: (recipe: Recipe) => void
  onViewDetails: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, isFavorite, onFavoriteClick, onViewDetails }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{recipe.prepTime} mins</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{recipe.servings} servings</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onViewDetails(recipe)}>
          View Recipe
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFavoriteClick(recipe)}
          className={isFavorite ? "text-red-500" : ""}
        >
          <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
      </CardFooter>
    </Card>
  )
}

