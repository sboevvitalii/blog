import { z } from "zod";

export const RegisterSchema = z
  .object({
    login: z
      .string()
      .min(3, "Логин не менее 3-х букв")
      .regex(/^[a-zA-Z]+$/, "Только латинские буквы, без символов"),
    email: z.string().email("Не корректный email"),
    password: z
      .string()
      .min(8, "Длинна пароля не менее 8 симоворлов")
      .regex(/[A-Z]/, "Должна быть хотя бы одна заглавная буква")
      .regex(/[0-9]/, "Должна быть хоть одна цифра"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
