# BotKits
## Описание проекта BotKits backend-часть

Данный проект является полноценным веб-сервисом, состоящий из back- **и front- **частей для удобного создания \*\*пользователями собственных ботов.

__[Notion](https://www.notion.so/BotKits-1c5c57b5337544d4a5c88c65d5868c4c) проекта и его функциональности__
__Ссылка на репозиторий проекта BotKits [frontend-часть](https://github.com/MrStnr21/botkits-14-frontend)__

***

## Запуск проекта
### Предварительная настройка

Для запуска необходимы Node.js старше 16.x, MongoDB не страше 5.0 и не младше 4.4, OS UBUNTU-20.04. 
Для запуска в Docker, убедитесь, что у вас есть два .env файла:

- .env (или .env.dev для разработки)

Примеры значений переменных можно увидеть в .env.example.

```yaml
# === Для работы приложения ===
APP_PORT=your_app_port                         # Порт, на котором будет слушать ваше nestjs-приложение.
JWT_SECRET=your_jwt_secret                     # Секретный ключ для JWT (JSON Web Tokens).
JWT_EXPIRES=your_jwt_lifetime                  # Время жизни JWT. (например 1d)
ALLOW_URL=your_allowed_url                     # Разрешенный URL политикой CORS
THROTTLE_TIME_WINDOW_SECONDS=your_time_window  # Окно времени для управления частотой запросов (например 1).
THROTTLE_REQUESTS_LIMIT=your_requests_limit    # Лимит запросов в окне времени для управления частотой (например 1000).

# === Для dockercompose ===
PORT_CONTAINER=your_container_port             # Порт внутри Docker-контейнера, на который будет проброшен APP_PORT.
MONGO_PORT=your_mongo_port                     # Порт MongoDB внутри Docker-контейнера.
MOCK_SERVER_PORT=                              # Порт на хосте для mock-сервера
MOCK_SERVER_CONTAINER_PORT=                    # Порт в контейнере для mock-сервера

# === Для Redis ===
REDIS_HOST=                                    # Хост для подключения к Redis (например, localhost или адрес контейнера Docker)
REDIS_PORT=                                    # Порт для подключения к Redis

# === Для RabbitMQ ===
RABBITMQ_URL=                                  # URL для подключения к RabbitMQ, включая имя пользователя и пароль
RABBITMQ_ERLANG_COOKIE=                        # 'Erlang cookie' для кластеризации и безопасности в RabbitMQ - строка
RABBITMQ_DEFAULT_USER=                         # Имя пользователя по умолчанию для доступа к RabbitMQ
RABBITMQ_DEFAULT_PASS=                         # Пароль по умолчанию для доступа к RabbitMQ

# === Для базы данных ===
DB_PORT=your_db_port                           # Порт для вашей базы данных MongoDB.
DB_USERNAME=your_db_username                   # Имя пользователя для вашей базы данных.
DB_PASSWORD=your_db_password                   # Пароль для вашей базы данных.
DB_HOST=your_db_host                           # Хост базы данных. Когда используется контейнер, он обычно называется именем службы в docker-compose, например 'mongo' или 'db'.
DB_NAME=your_db_name                           # Название вашей базы данных в MongoDB.
DB_REPLICATION_SET=your_replication_set        # Набор репликаций для MongoDB (например rs01).

# === Yandex OAuth ===
YANDEX_APP_ID=""                               # Идентификатор приложения для Yandex OAuth.
YANDEX_APP_SECRET=""                           # Секретный ключ приложения для Yandex OAuth.
YANDEX_TOKEN_URL=""                            # URL для получения токена для Yandex OAuth.
YANDEX_USER_INFO_URL=""                        # URL для получения информации пользователя для Yandex OAuth.

# === Google OAuth ===
GOOGLE_APP_ID=""                               # Идентификатор клиента для Google OAuth.
GOOGLE_APP_SECRET=""                           # Секретный ключ клиента для Google OAuth.
GOOGLE_CALLBACK_URL=""                         # URL обратного вызова для Google OAuth.
GOOGLE_RES_REDIRECT_URL=""                     # URL перенаправления ответа сервера для Google OAuth.

# === VK OAuth ===
VK_APP_ID=""                                   # Идентификатор клиента для VK OAuth.
VK_APP_SECRET=""                               # Секретный ключ клиента для VK OAuth.
VK_CALLBACK_URL=""                             # URL обратного вызова для VK OAuth.
VK_RES_REDIRECT_URL=""                         # URL перенаправления ответа сервера для VK OAuth.

# === Mail.Ru OAuth ===
MAILRU_APP_ID=""                               # Идентификатор приложения для Mail.Ru OAuth.
MAILRU_APP_SECRET=""                           # Секретный ключ приложения для Mail.Ru OAuth.
MAILRU_TOKEN_URL=""                            # URL для получения токена для Mail.Ru OAuth.
MAILRU_USER_INFO_URL=""                        # URL для получения информации пользователя для Mail.Ru OAuth.
MAILRU_REDIRECT_URL=""                         # URL перенаправления для Mail.Ru OAuth.

# === Telegram OAuth & Bot ===
TELEGRAM_BOT_TOKEN=""                          # Токен для Telegram Bot.
TELEGRAM_APP_ID=""                             # Идентификатор приложения для Telegram OAuth.
TELEGRAM_APP_HASH=""                           # Хэш приложения для Telegram OAuth.
```

***

### MongoDb работает с транзакциями, поэтому необходимо установить набор реплик

__Шаг 1:__ Найдите файл конфигурации MongoDB на вашем устройстве. Обычно он называется __mongod.conf.__ в некоторых случаях __mongod.cfg.__

__Шаг 2:__ Добавьте следующие строки в ваш файл конфигурации:
```
replication:
  replSetName: "rs0"  # имя набора реплик
```
__Шаг 3:__ Сохраните и закройте файл конфигурации.

__Шаг 4:__ Перезапустите MongoDB с обновленной конфигурацией. В зависимости от вашей операционной системы выполните одну из следующих команд в терминале:
- Windows:
```
mongod --config "путь\до\вашего\mongod.conf" --install
```
- MacOS:
```
brew services start mongodb-community --config=/путь/до/вашего/mongod.conf
```
__Шаг 5:__ Откройте MongoDB shell, выполнив следующую команду в терминале:
```
mongo
```
__Шаг 6:__ После успешного подключения инициализируйте репликацию, введя следующую команду в MongoDB shell:
```
rs.initiate()
```
__Шаг 7:__ Проверьте статус репликации, введя следующую команду в MongoDB shell:
```
rs.status()
```
__Шаг 8:__ В файле с переменными среды (env) вашего проекта добавьте следующую строку:
```
DB_REPLICATION_SET=name replication set
```
***
### Redis
Для работы чатов, а в будущем для кеширования запросов в проекте используется БД Redis. 

**Шаг 1: Установка.**
Установите Redis локально [Ссылка на иструкции по установке на разные ОС](https://redis.io/docs/install/install-redis/)

**Шаг 2: Запуск.**
Сначала запустите сервис с Redis
```
sudo service redis-server start
```

После запуска ведите команду в терминале 
```
redis-cli
```
**Шаг 3: Проверка запуска.**
Введите команду ping в терминале вы должны увидеть ответ PONG
```
redis 127.0.0.1:6379> ping
PONG
```
**Шаг 4: Режим отладки.**
Для отладки введите команду monitor в терминале
```
redis 127.0.0.1:6379> monitor
OK
```

***

### RabbitMQ

Для работы чатов, рассылок и прочих задач требующих ресурсы используется обработик очереди задач RabbitMQ

Для Windows можно установить через Chocolate. Так же вам потребуется установить язык программирования Erlang.  На все вопросы отвечайте утвердительно, установится так же Erlang.
```
choco install rabbitmq
```
Для остальных [Ссылка на иструкции по установке на разные ОС](https://www.rabbitmq.com/docs/download)

***

### Запуск в режиме разработки
**Шаг 1: Подготовка первого запуска.**

Сначала подготовьте микросервисы к работе и установите зависимости в проекте. В корне проекта введите в командной строке команду и дождитесь её завершения.
```
npm run prepare-services
```
Это установит все пакеты в микросервисах для работы бэкенда, чатов и воркера для обработки событий в Redis в будущем.

**Шаг 2: Запуск.**

Если вам нужно работать с чатом или воркером с redis, то перед запуском бэкенда запутсите сервисы

__Worker__
```
npm run worker
```
Эта команда запустит сервис для работы с событиями в Redis а так же для обработки событий на моковом сервере с моковым чатом и API.

__MockServer__
```
npm run mock
```
Это запустит моковый стенд для обработки событий по WS мокового чата и отправки событий в Redis. 

__Бэкенд часть проекта__ 
Запустит проект и позволит видеть изменения которые вы делаете в проекте в реальном времени
```
npm run start:dev
```
### Запуск в режиме production
```
docker-compose -f docker-compose.yml --env-file .env up -d
```
Развернет все приложение месте с микросервисами в контейнерах, запустит их в нужном порядке и вы сможете отправлять запросы на контейнера с номерами портов указанных в env файле.

***

### Использование AppClusterService для Кластеризации
#### Описание

`AppClusterService` — это класс, предназначенный для оптимизации использования ресурсов многоядерных систем в Node.js приложениях с помощью кластеризации. Он позволяет легко создавать несколько экземпляров Node.js (кластеров), работающих параллельно на разных ядрах процессора, что повышает производительность и надёжность приложения.

#### Как это работает

Класс использует модуль `cluster` Node.js для создания "главного" процесса (primary), который затем порождает несколько "рабочих" процессов (workers) — кластеров. Каждый кластер выполняет одинаковый код и работает на отдельном ядре процессора. Это позволяет более эффективно распределять нагрузку и повышает отказоустойчивость системы, так как при сбое одного кластера, остальные продолжают работать, и проблемный кластер может быть перезапущен.

#### Пример использования

Для использования `AppClusterService`, необходимо вызвать его метод `clusterize`, передав в него функцию, которую вы хотите выполнить в каждом кластере, и, опционально, количество ядер, которое вы хотите использовать.

```
import { AppClusterService } from './path/to/AppClusterService';

AppClusterService.clusterize(() => {
  // Ваш код, который будет исполняться в каждом кластере
}, numCores);
```

***

### Для того чтобы увидеть документацию Swagger
```
<url>:<порт на котором запущен сервер>/api/docs 
#Пример http://127.0.0.1:3001/api/docs
```

## Команда backend части проекта 14 когорты

- [Евгений Русаков - teemlead](https://github.com/Shoomec74)
- [Семен Чехов](https://github.com/JustSimon01)
- [Екатерина Осипова](https://github.com/kur0yuki)
- [Анастасия Разживина](https://github.com/Virshinia)
- [Антон Помазков](https://github.com/pomazkovanton)
- [Анна Силина](https://github.com/annasilina)
- [Иван Антипенко](https://github.com/Ivan-Antipenko)
- [Наталья Беликова](https://github.com/pblHbKa)
***