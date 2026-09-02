import { z } from "zod";

export const moduleSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug invalide (minuscules, chiffres, tirets)"),
  description: z.string().trim().max(2000),
  filiere: z.enum(["culture", "elevage_bovin", "elevage_avicole", "autre"]),
  niveau: z.enum(["debutant", "intermediaire", "avance"]),
  contenu: z.string().max(50000),
  published: z.boolean().default(false),
});

export type ModuleInput = z.infer<typeof moduleSchema>;

export const roleUpdateSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "formateur", "apprenant"]),
});