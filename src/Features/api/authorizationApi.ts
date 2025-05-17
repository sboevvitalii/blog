import prisma from "./prisma";
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
    // 1. Валидация входных данных
    if (!login || !password) {
      throw new Error("Логин и пароль обязательны");
    }

    // 2. Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { login },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // 3. Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Неверный пароль");
    }

    // 4. Генерация JWT-токена
    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. Возвращаем данные пользователя (без пароля) и токен
    return {
      user: {
        id: user.id,
        login: user.login,
        role: user.role.name,
      },
      token,
    };
  } catch (error: unknown) {
    // 6. Обработка ошибок
    if (error instanceof Error) {
      throw error; // Пробрасываем наши кастомные ошибки
    }
    console.error("Ошибка авторизации:", error);
    throw new Error("Произошла ошибка при авторизации");
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Получаем токен из заголовков
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
