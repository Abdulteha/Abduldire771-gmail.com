export interface CatData {
  id: string;
  imageUrl: string;
  description: string;
  name: string;
  createdAt: number;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}
