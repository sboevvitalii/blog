blog
Сущность приложения:

- пользователь: БД (список пользователей), BFF (сессия текущего), стор (отображение в браузере)
- роль пользователя БД (список ролей), BFF (сессия пользователя с ролью), стор (использование на клиенте)
- статья: БД (список статей), стор (отображение в браузере)
- комментарий: БД (список коментариев), стор (отображение в браузере)

Таблицы БД:

- пользователи – users: id / login / password / registed_at / role_id
- роли - roles: id / name
- статьи – posts: id / title / image_url / content / published_at
- коментарии – comments: id / autor_id / post_id / content / published_at

Схема состояния на BFF

- сессия текущего пользователя: login / password / role

Схема редакс стора (на клиенте):

- user: id / login / roleId / session
- posts: массив post: id / title / imageUrl / publishedAt / commentsCount
- post: id / title / imageUrl / content / publishedAt / comments: массив comment: id / author / content / publishedAt
- users: массив user: id / login / registeredAt / role
