import prisma from "./prisma";
import bcrypt from "bcrypt";

interface CreateUserInput {
  login: string;
  password: string;
  roleId?: number;
}

export async function createUser({
  login,
  password,
  roleId = 2,
}: CreateUserInput) {
  if (!login || !password) {
    throw new Error("Логин и пароль обязательны");
  }

  if (password.length < 8) {
    throw new Error("Пароль должен содержать минимум 8 символов");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        roleId,
        registeredAt: new Date(),
      },
      select: {
        id: true,
        login: true,
        registeredAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return createdUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Пользователь с таким логином уже существует");
    }
    console.error("Ошибка при создании пользователя:", error);
    throw new Error("Не удалось создать пользователя");
  }
}

export async function getUser(login: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { login },
      select: {
        login: true,
        roleId: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Ошибка при получении пользователя");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateUser(id: number, roleId: number) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roleId },
    });
    return updatedUser;
  } catch (error) {
    console.error("Ошибка при обновлении пользователя");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteUser(id: number) {
  try {
    return prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error("Ошибка при удалении пользователя");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
