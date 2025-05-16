import prisma from "./prisma";

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
