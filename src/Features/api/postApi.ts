import prisma from "./prisma";

export async function createPost(
  title: string,
  imageUrl: string,
  content: string,
  authorId: number
) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        imageUrl,
        content,
        authorId,
      },
      include: {
        author: true,
        comments: true,
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

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

export async function deletePost(postId: number) {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new Error("Пост с указанным ID не найден");
    }

    const deletedPost = await prisma.post.delete({
      where: { id: postId },
      include: {
        comments: true, // если нужно получить информацию об удаленных комментариях
      },
    });

    return deletedPost;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
