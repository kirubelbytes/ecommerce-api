import z, { array, number, string } from "zod";

export const singUpSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email : z.string().email("Invalid email address"),
    password : z.string().min(8,  "Password must be atleast 8 character long")
});

export const logInSchema = z.object({
    email : z.string().email("Invalid email eddress"),
    password : z.string().min(8, "Password must be atleast 8 character long")
});

export const createProductSchema = z.object({
    name: string().min(1, "Name is required").max(20),
    description: string().min(1, "Description is required"),
    price : number().positive("Price must be Positive"),
    tags : z.union([
        z.array(z.string()).nonempty("Atleast one tag is required"),
        z.string().min(1, "Tags string can't be empty")
    ])
});

export const paginationSchema = z.object({
  skip: z.string().optional().transform((val) => {
      const num = Number(val);
      return Number.isFinite(num) && num >= 0 ? num : 0;
    }),
  take: z.string().optional().transform((val) => {
      const num = Number(val);
      return Number.isFinite(num) && num > 0 && num <= 50 ? num : 20;
    }),
});

export const addressSchema = z.object({
    lineOne : z.string(),
    lineTwo : z.string().nullable(),
    pincode : z.string().length(6),
    country : z.string(),
    city : z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().nullable().optional(),
  defaultShippingAddress: z.number().nullable().optional(),
  defaultBillingAddress: z.number().nullable().optional(),
});