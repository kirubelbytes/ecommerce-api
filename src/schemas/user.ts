import z from "zod";

export const singUpSchema = z.object({
    name: z.string(),
    email : z.string(),
    password : z.string().min(4,  "Password must be atleast 8 character long")
});

