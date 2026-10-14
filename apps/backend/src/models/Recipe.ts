import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeIngredient {
  inventoryItemId: mongoose.Types.ObjectId;
  ingredientName: string;
  quantityRequired: number;
  unit: string; // 'g', 'ml', 'piece', 'shot', etc.
}

export interface IRecipe extends Document {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  ingredients: IRecipeIngredient[];
  beverageItemId?: mongoose.Types.ObjectId; // 1-to-1 direct link for packaged beverage deduction (e.g. Red Bull can)
  prepInstructions?: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeIngredientSchema = new Schema<IRecipeIngredient>(
  {
    inventoryItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    ingredientName: { type: String, required: true },
    quantityRequired: { type: Number, required: true, min: 0.001 },
    unit: { type: String, required: true },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true, unique: true, index: true },
    name: { type: String, required: true },
    ingredients: [RecipeIngredientSchema],
    beverageItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },
    prepInstructions: { type: String },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RecipeModel = mongoose.model<IRecipe>('Recipe', RecipeSchema);
