import prisma from "./prisma";

export async function getPost(id: number) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return post;
  } catch (error) {
    console.error("Ошибка при полчуении поста");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updatePost(
  id: number,
  data: {
    title: string;
    imageUrl: string;
    content: string;
    comments?: Array<{
      id?: number;
      content?: string;
    }>;
  }
) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        content: data.content,
      },
      include: { comments: true },
    });
    return updatedPost;
  } catch (error) {
    console.error("Ошибка при обновлении поста");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
