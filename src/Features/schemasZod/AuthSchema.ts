import { z } from "zod";

export const AuthSchema = z.object({
  login: z
    .string()
    .min(3, "Логин не менее 3-х букв")
    .regex(/^[a-zA-Z]+$/, "Только латинские буквы, без символов"),
  password: z
    .string()
    .min(8, "Длинна пароля не менее 8 симоворлов")
    .regex(/[A-Z]/, "Должна быть хотя бы одна заглавная буква")
    .regex(/[0-9]/, "Должна быть хоть одна цифра"),
});

export type AuthFormData = z.infer<typeof AuthSchema>;
