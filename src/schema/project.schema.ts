import { Schema } from 'mongoose';

export const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  contractSignedOn: { type: Date },
  imageUrl: { type: String },
});
