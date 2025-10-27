import z from "zod";

export const singUpSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email : z.string().email("Invalid email address"),
    password : z.string().min(8,  "Password must be atleast 8 character long")
});

export const logInSchema = z.object({
    email : z.string().email("Invalid email eddress"),
    password : z.string().min(8, "Password must be atleast 8 character long")
});
