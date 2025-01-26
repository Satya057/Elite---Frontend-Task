import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Recipe } from "../types/recipe"
import Image from "next/image"

interface RecipeDetailProps {
  recipe: Recipe | null
  open: boolean
  onClose: () => void
}

export function RecipeDetail({ recipe, open, onClose }: RecipeDetailProps) {
  if (!recipe) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
          <DialogDescription>
            {recipe.prepTime} minutes • {recipe.servings} servings
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
        </div>
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold">Ingredients</h3>
            <ul className="ml-6 list-disc">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Instructions</h3>
            <ol className="ml-6 list-decimal">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

