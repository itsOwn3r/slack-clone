import * as z from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, {
    message: "The name must be 2 characters, at least!"
  }),
  email: z.string().email().min(8, {
    message: "Please enter a valid email!"
  }),
  password: z.string().min(8, {
    message: "Error! Password needs to be 8 characters at least!",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email().min(8, {
    message: "Please enter a valid email!"
  }),
  password: z.string().min(8, {
    message: "Error! Password needs to be 8 characters at least!",
  }),
});