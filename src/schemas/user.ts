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
    tags : array(z.string()).nonempty("At least one tag is required")
});