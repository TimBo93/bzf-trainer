export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface CategoriesData {
  categories: Category[];
  questionMapping: Record<string, string>;
}
