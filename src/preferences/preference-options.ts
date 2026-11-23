// shared with proposals (diet tags) for the compatibility check
export const FOOD_OPTIONS = [
  'vegetarian',
  'vegan',
  'gluten_free',
  'lactose_free',
  'halal',
  'kosher',
] as const;

export const ACTIVITY_OPTIONS = [
  'culture',
  'gastronomy',
  'nature',
  'beach',
  'nightlife',
  'sports',
  'shopping',
  'relax',
] as const;

export type FoodOption = (typeof FOOD_OPTIONS)[number];
export type ActivityOption = (typeof ACTIVITY_OPTIONS)[number];
