export interface Project {
  id?: string;
  name: string;
  description: string;
  budget: number;
  isActive: boolean;
  contractSignedOn?: Date;
  imageUrl?: string;
}
