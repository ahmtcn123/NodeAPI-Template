import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).required();

export type User = z.infer<typeof UserSchema>;

export const LoginInputSchema = z.object({
  email: z.string({
    message: "email_is_required",
  }).email({
    message: "email_is_invalid",
  }).min(5, {
    message: "email_is_too_short",
  }).max(255, {
    message: "email_is_too_long",
  }),
  password: z.string({
    message: "password_is_required",
  }).min(8, {
    message: "password_is_too_short",
  }).max(255, {
    message: "password_is_too_long",
  })
}).required().describe("LoginInput");

export type LoginInput = z.infer<typeof LoginInputSchema>;
 