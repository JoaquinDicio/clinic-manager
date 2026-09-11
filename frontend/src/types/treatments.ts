export type Treatment = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  active: boolean;
  created_at: string;
};
export type TreatmentForm = {
  name: string;
  description?: string;
  price?: number;
};
