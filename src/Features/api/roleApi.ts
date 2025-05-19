import prisma from "./prisma";

export async function getRole(id: number) {
  try {
    const role = await prisma.role.findUnique({ where: { id } });
    return role;
  } catch (error) {
    console.error("Ошибка при полчуении поста");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateRole(id: number, name: string) {
  try {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new Error(`Роль с ID ${id} не найдена`);
    }
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
      },
    });
    return updatedRole;
  } catch (error) {
    console.error("Ошибка при обновлении роли:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
