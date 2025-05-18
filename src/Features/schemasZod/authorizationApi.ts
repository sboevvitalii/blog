import prisma from "../api/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface AuthResponse {
  user: {
    id: number;
    login: string;
    role: string;
  };
  token: string;
}

export async function loginUser(
  login: string,
  password: string
): Promise<AuthResponse> {
  try {
    if (!login || !password) {
      throw new Error("Логин и пароль обязательны");
    }

    const user = await prisma.user.findUnique({
      where: { login },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Неверный пароль");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        login: user.login,
        role: user.role.name,
      },
      token,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Ошибка авторизации:", error);
    throw new Error("Произошла ошибка при авторизации");
  }
}

export function authMiddleware(req: Request, res: Response) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Требуется авторизация");
    }

    // 2. Верифицируем токен
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    // 3. Добавляем данные пользователя в запрос
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Неверный или просроченный токен",
    });
  }
}
