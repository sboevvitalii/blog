import prisma from "./prisma";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Ошибка при полчуении списка пользователей");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
