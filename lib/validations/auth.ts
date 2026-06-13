import z, { email } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const pharmacySchema = z.object({
  pharmacyName: z.string().min(1, "Pharmacy name is required"),
  pharmacyEmail: z.string().email("Invalid pharmacy email"),
  pharmacyPhone: z.string().min(1, "Phone number is required"),
  pharmacyAddress: z.string().min(1, "Please select a location on the map"),
  pharmacyLat: z.number({ error: "Location is required" }),
  pharmacyLng: z.number({ error: "Location is required" }),
});

export const registerOwnerSchema = registerUserSchema
  .merge(pharmacySchema)
  .extend({
    terms: z.literal(true, { error: "You must accept the terms" }),
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;