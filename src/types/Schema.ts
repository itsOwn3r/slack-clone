import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email().min(8, {
    message: "Please enter a valid email!"
  }),
  password: z.string().min(8, {
    message: "Error! Password needs to be 8 characters at least!",
  }),
});