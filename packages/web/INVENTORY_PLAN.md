## План впровадження модуля складу (Inventory)

Примітка: позначки [DONE] — вже реалізовано; [NEXT] — найближчі наступні кроки.

### 1) Архітектура даних
- Part (деталь)
  - id (uuid)
  - projectId (uuid)
  - code (string, unique per project)
  - name (string)
  - description (string | null) [DONE]
  - groupId (uuid | null)
  - unit (string, напр. pcs, m, kg)
  - targetQuantity (number | null) — бажана кількість
  - isActive (boolean)
- PartGroup (група)
  - id (uuid)
  - projectId (uuid)
  - name (string)
  - description (string | null)
  - sortOrder (number)
- InventoryLog (рух інвентарю)
  - id (uuid)
  - projectId (uuid)
  - partId (uuid)
  - type: PURCHASE | PRODUCTION | ADJUSTMENT
  - quantity (number > 0)
  - createdAt (datetime)
  - createdById (uuid)
  - note (string | null)
  - taskLogId (uuid | null) — зв'язок з реєстрацією задач, якщо застосовно

Примітки:
- currentQuantity для деталі = сума `quantity` з InventoryLog для конкретної `partId` у межах `projectId`.
- requiredQuantity = (targetQuantity ?? 0) - currentQuantity (не від'ємна при відображенні).
- Для відкатів/видалень `task_log` — або створюємо зворотній ADJUSTMENT, або м'яко видаляємо пов'язаний запис (рішення обрати на етапі інтеграції).
- Генерація коду Part: під час створення деталі код генерується автоматично за форматом `<PROJECT_CODE>-<NUMBER>` [DONE]
  - `<PROJECT_CODE>` — береться з налаштувань проєкту (поле `projectCode`, 3 символи A–Z/0–9, зберігаємо у верхньому регістрі) [DONE]
  - `<NUMBER>` — інкрементальний номер у межах проєкту з zero-pad до 4 [DONE]

---

### 2) API (REST)
- GET /projects/:projectId/inventory
  - Повертає список деталей з агрегованими полями: `currentQuantity`, `requiredQuantity` та даними групи [DONE]
  - Фільтри: groupId, search (code/name), onlyDeficit (requiredQuantity > 0)
- Пагінація для inventory та logs [DONE]
- GET /projects/:projectId/inventory/parts
- POST /projects/:projectId/inventory/parts
  - Тіло: { name, description?, groupId?, unit, targetQuantity? } — поле `code` не передаємо (генерується бекендом) [DONE]
  - Створює деталь з початковою кількістю = 0 [DONE]
  - Генерація коду на основі `projectCode` проєкту [DONE]
- PATCH /projects/:projectId/inventory/parts/:partId
  - Оновлення метаданих (targetQuantity, name, unit, groupId, isActive, description) [DONE]
- POST /projects/:projectId/inventory/parts/:partId/logs
  - Тіло: { type, quantity, note? } [DONE]
  - Додає рух інвентарю (purchase/production/adjustment), quantity > 0 [DONE]
- GET /projects/:projectId/inventory/parts/:partId/logs
  - Повертає історію рухів (із пагінацією) [DONE]
- GET /projects/:projectId/inventory/units — стандартизований словник одиниць [DONE]
- Інтеграція з task-logs:
  - POST /task-logs/register — при наявності `partId` і `quantity` → створювати InventoryLog(type=PRODUCTION, quantity, partId, projectId, taskLogId) [DONE]

Авторизація:
- ADMIN, PROJECT_MANAGER — повний доступ (CRUD деталей, створення логів)
- WORKER — перегляд + автоматичне створення PRODUCTION через реєстрацію задач (без прямого CRUD на інвентар)

---

### 3) UI (сторінка ProjectInventory)
- Лейаут: як Tasks/Products — заголовок, кнопка додавання, секції-карти
- Список деталей з групуванням (Accordion/Collapse по групах)
  - Колонки: Код, Назва, Опис, Одиниця (editable), Група (editable), Поточна, Цільова (inline editable), Потрібно, Статус (Active toggle), Дії [DONE]
  - Підсвічування дефіцитних (requiredQuantity > 0) [DONE]
  - Інлайн-редагування targetQuantity з дебаунсом (PATCH) [DONE]
- Фільтри/пошук
  - Пошук по коду/назві, фільтр по групі, чекбокс «Лише дефіцитні» [DONE]
- Додавання логів
  - Кнопка «Додати» в рядку деталі → модалка: тип, кількість, коментар [DONE]
- Перегляд логів
  - Кнопка «Логи» → сайдпанель з історією [DONE]
- CRUD деталей
  - Модалка створення деталі: name, description, group (Select), unit (Select), targetQuantity [DONE]
  - Код не вводиться вручну — генерується бекендом [DONE]

Вибір одиниць (unit):
- Список одиниць використовується статичний (pcs, kg, g, m, cm, mm, l) [DONE]; централізація словника [NEXT]
- Перейти на бекенд-ендпоїнт `/inventory/units` для джерела правди [DONE]
- Списки inventory та logs мають використовувати пагінацію (`page`, `pageSize`) і метадані (`total`, `totalPages`) [DONE]

UX деталі:
- Не показувати «0» там, де значення відсутнє (напр., targetQuantity)
- Стани завантаження/помилок з toast і плацхолдерами
- Респонсивна таблиця (стислі колонки на мобільному)

---

### 4) Інтеграція з реєстрацією задач
- У формі TaskRegister додати опцію «Прив'язати до деталі» (select part) для задач з `quantity`
- Після успішного сабміту та створення task_log — викликати бекенд для створення InventoryLog(type=PRODUCTION) з переданою `quantity`
- При видаленні task_log — компенсуючий ADJUSTMENT або видалення пов'язаного лог-запису (узгодити підхід)
- Забезпечити ідемпотентність: унікальний `InventoryLog(taskLogId)` + перевірка повторів [DONE]
- `createdById` брати з JWT у контролері/сервісі, не з DTO [DONE]

Правила:
- Якщо `quantity` не вказано — логу не створюємо (або quantity=1 для певних типів задач, якщо так визначено процесом — потребує окремого рішення)

---

### 4.1) Task Recipe System (Рецепт задачі)
**Мета:** Додати до задач можливість налаштувати "рецепт", який автоматично визначає які деталі виробляються та споживаються при виконанні задачі.

**Архітектура даних:**
- `TaskOutputPart` (вихідні деталі)
  - `taskId` (uuid)
  - `partId` (uuid)
  - `perUnit` (Decimal) — кількість деталей на одиницю виконання задачі [DONE]
- `TaskPartConsumption` (споживані деталі)
  - `taskId` (uuid)
  - `partId` (uuid)
  - `quantityPerUnit` (Decimal) — кількість деталей на одиницю виконання задачі [DONE]

**Backend API (реалізовано):**
- `GET /tasks/:taskId/recipe` — отримати рецепт задачі (outputs + consumptions) [DONE]
- `POST /tasks/:taskId/recipe/outputs` — додати/оновити вихідну деталь [DONE]
  - Тіло: `{ partId, perUnit }`
  - Доступ: ADMIN, PROJECT_MANAGER (з TaskProjectAccessGuard) [DONE]
- `DELETE /tasks/:taskId/recipe/outputs/:partId` — видалити вихідну деталь [DONE]
- `POST /tasks/:taskId/recipe/consumptions` — додати/оновити споживану деталь [DONE]
  - Тіло: `{ partId, quantityPerUnit }`
  - Доступ: ADMIN, PROJECT_MANAGER (з TaskProjectAccessGuard) [DONE]
- `DELETE /tasks/:taskId/recipe/consumptions/:partId` — видалити споживану деталь [DONE]

**Автоматична інтеграція з реєстрацією задач:**
- При реєстрації задачі (`POST /task-logs/register`) з `quantity > 0`:
  - Автоматично створюються `InventoryLog(type=PRODUCTION)` для всіх `TaskOutputPart` [DONE]
    - `quantity = perUnit * taskQuantity`
  - Автоматично створюються `InventoryLog(type=PRODUCTION, negative)` для всіх `TaskPartConsumption` [DONE]
    - `quantity = -quantityPerUnit * taskQuantity`
    - Перевірка достатності інвентарю перед споживанням [DONE]
  - Валідація: всі parts мають належати до того ж проекту, що й задача [DONE]
- Ідемпотентність: перевірка унікальності `taskLogId` в InventoryLog [DONE]

**Frontend UI (частково реалізовано):**
- Сторінка `TaskRecipeEditor.tsx` для редагування рецепта [DONE]
  - Маршрут: `/tasks/:taskId/recipe` [DONE]
  - Доступ: ADMIN, PROJECT_MANAGER [DONE]
  - Таблиці для outputs та consumptions [DONE]
  - Додавання/видалення записів [DONE]
  - Завантаження списку деталей з проекту [DONE]
- Кнопка "Рецепт" в таблиці задач (`TasksTable.tsx`) [DONE]
  - Відкриває сторінку редагування рецепта [DONE]

**Реалізовано (Етап 4.1):**
- UI: Покращено `TaskRecipeEditor`:
  - ✅ Замінено введення `partId` на Select з пошуком (code + name) [DONE]
  - ✅ Додано валідацію perUnit та quantityPerUnit (має бути > 0) [DONE]
  - ✅ Показано назви деталей (code + name) в таблицях замість ID [DONE]
  - ✅ Додано інформацію про поточну кількість деталей для consumptions [DONE]
  - ✅ Додано попередження при недостатності інвентарю (бейдж "Мало" та Alert) [DONE]
- UI: Додано індикатор наявності рецепта в списку задач:
  - ✅ Фіолетовий бейдж з іконкою "Рецепт" для задач з налаштованим рецептом [DONE]
  - ✅ Модальне вікно для швидкого перегляду рецепта без переходу на окрему сторінку (`TaskRecipeViewModal`) [DONE]
- UI: Покращено UX:
  - ✅ Додано інформаційний блок з підказками про те, як працює рецепт [DONE]
  - ✅ Додано приклади використання з розрахунками [DONE]
  - ✅ Валідація при збереженні з відображенням помилок [DONE]
  - ✅ Пошук деталей за кодом та назвою [DONE]
  - ✅ Виключення вже доданих деталей зі списку вибору [DONE]
- Backend: Покращено API:
  - ✅ `GET /tasks/:taskId/recipe` повертає `projectId` для завантаження деталей [DONE]
  - ✅ `GET /projects/:projectId/tasks` повертає поле `hasRecipe` для кожної задачі [DONE]
- Документація: Додано опис рецептів в Swagger [DONE]
  - ✅ Детальні описи для всіх DTO полів з прикладами [DONE]
  - ✅ Описано всі endpoints з `@ApiOperation`, `@ApiParam`, `@ApiResponse` [DONE]
  - ✅ Додано `TaskRecipeResponseDto` для типізації відповіді [DONE]
- Тестування: Покрито тестами автоматичну інтеграцію з реєстрацією [DONE]
  - ✅ Створено `task-logs.recipe.integration.spec.ts` з інтеграційними тестами [DONE]
  - ✅ Тести перевіряють створення output та consumption logs [DONE]
  - ✅ Тести перевіряють валідацію достатності інвентарю [DONE]
  - ✅ Тести перевіряють правильність розрахунків (perUnit × quantity) [DONE]
  - ✅ Тести перевіряють ідемпотентність [DONE]

---

### 4.2) Task Groups System (Групи задач)
**Мета:** Додати можливість групувати задачі в рамках проекту для кращої організації та структурування.

**Архітектура даних:**
- `TaskGroup` (група задач)
  - `id` (uuid)
  - `projectId` (uuid)
  - `name` (string) — назва групи
  - `description` (string | null) — опис групи
  - `sortOrder` (number) — порядок сортування для відображення
  - `createdAt` (datetime)
  - `updatedAt` (datetime)
- `Task` (оновлення моделі)
  - Додати поле `groupId` (uuid | null) — посилання на групу задач
  - Задача може належати групі або не мати групи (null)

**Backend API (планується):**
- `GET /projects/:projectId/task-groups` — отримати список груп задач для проекту
  - Повертає: `{ groups: TaskGroup[] }`
  - Сортування за `sortOrder`
- `POST /projects/:projectId/task-groups` — створити нову групу задач
  - Тіло: `{ name, description?, sortOrder? }`
  - Доступ: ADMIN, PROJECT_MANAGER
- `PUT /projects/:projectId/task-groups/:groupId` — оновити групу задач
  - Тіло: `{ name?, description?, sortOrder? }`
  - Доступ: ADMIN, PROJECT_MANAGER
- `DELETE /projects/:projectId/task-groups/:groupId` — видалити групу задач
  - При видаленні: задачі, що належали групі, отримують `groupId = null`
  - Доступ: ADMIN, PROJECT_MANAGER
- `GET /projects/:projectId/tasks` — оновлено для включення `groupId` та даних групи
  - Повертає задачі з полем `group: { id, name, sortOrder } | null`
- `POST /tasks` — оновлено для прийняття `groupId` (опціонально)
- `PUT /tasks/:id` — оновлено для зміни `groupId` (опціонально)

**Frontend UI (планується):**
- Сторінка управління групами задач (аналогічно PartGroups):
  - Список груп з можливістю редагування/видалення
  - Модалка створення/редагування групи: name, description, sortOrder
- Сторінка списку задач (`Tasks.tsx`) — оновлення:
  - Групування задач за групами (Accordion/Collapse)
  - Підсумок: "Без групи" для задач без групи
  - Фільтр по групі (Select)
- Форми створення/редагування задачі:
  - Поле вибору групи (Select) — опціонально
  - Варіанти: "Без групи" або вибір зі списку груп проекту

**Етапи реалізації:**
- Етап 4.2.1: Backend — моделі даних та міграції [NEXT]
  - Створити модель `TaskGroup` в Prisma schema
  - Додати поле `groupId` до моделі `Task`
  - Створити міграцію
- Етап 4.2.2: Backend — API endpoints [NEXT]
  - CRUD операції для TaskGroup
  - Оновити Task API для підтримки `groupId`
  - Додати Swagger документацію
- Етап 4.2.3: Frontend — UI управління групами [NEXT]
  - Сторінка/модалки для CRUD груп задач
  - Інтеграція в ProjectMenu або на сторінці Tasks
- Етап 4.2.4: Frontend — UI списку задач з групуванням [NEXT]
  - Оновити `Tasks.tsx` для групування за групами
  - Додати фільтр по групі
  - Оновити форми створення/редагування задачі

---

### 5) Валідації та інваріанти
- quantity > 0 для всіх створюваних логів
- targetQuantity ≥ 0
- Заборонити негативний `currentQuantity` (транзакційність при створенні логів)
- Унікальність `code` в межах `projectId`

---

### 6) Міграції та індекси
- Таблиці: PartGroup, Part, InventoryLog
- Індекси:
  - Part: (projectId, code) UNIQUE, (projectId, groupId) [DONE]
  - InventoryLog: (projectId, partId, createdAt DESC) [DONE]
- Міграції виконані для базових таблиць; поле `description` у Part — додано, потребує застосування міграції на середовищі [NEXT]
- Застосувати індекси на середовищах через `prisma migrate deploy` [DONE]

---

### 7) Аналітика/звіти (етап 2+)
- Перелік дефіцитних деталей (required > 0) [DONE]
- Рухи за період з агрегацією по type [DONE]
- ТОП дефіцитних деталей [DONE]

---

### 8) Безпека та аудит
- InventoryLog — immutable (без редагування, лише нові коригуючі записи)
- Рольова модель як вище; логування дій (createdById)
-
- Project access guard: додати guard перевірки доступу до проєкту на всі inventory-ендпоїнти (аналог project-access.guard) [DONE]
- createdById: проставляти з аутентифікованого користувача (JWT) під час створення InventoryLog [DONE]
- Зв'язки: валідовувати відповідність partId проекту (part.projectId === :projectId) при створенні логів, відхиляти перехресні записи
  
Статус: guard-и і createdById — додано на ендпоінтах інвентаря [DONE]

---

### 9) Етапи впровадження
- Етап 1: Моделі/міграції + базові API (GET inventory, POST/PATCH parts) [DONE]
- Етап 2: UI список з групами + створення/редагування деталей [DONE]
- Етап 3: API логів + UI додавання/перегляду логів [DONE]
- Етап 4: Інтеграція з task-logs (автом. PRODUCTION) [DONE]
  - Recipe System backend API [DONE]
  - Автоматична інтеграція з реєстрацією задач [DONE]
  - Базовий UI редактора рецептів [DONE]
- Етап 4.1: Покращення UI Recipe Editor та документація [DONE]
  - Покращений UI з Select, валідацією, пошуком [DONE]
  - Індикатор рецепта в списку задач [DONE]
  - Швидкий перегляд рецепта (модальне вікно) [DONE]
  - Підказки та приклади використання [DONE]
  - Swagger документація [DONE]
  - Інтеграційні тести [DONE]
- Етап 4.2: Task Groups System (Групи задач) [NEXT]
  - Backend: моделі даних та міграції [NEXT]
  - Backend: API endpoints для CRUD груп задач [NEXT]
  - Frontend: UI управління групами [NEXT]
  - Frontend: групування задач в списку та фільтрація [NEXT]
- Етап 5: Звіти/фільтри/оптимізації (пагінація, індекси, кешування) [NEXT]

---

### 10) Ризики/застереження
- Узгодження unit та стандартизація
- Ідемпотентність при відкатах/повторних сабмітах
- Продуктивність на великих списках (вчасно додати пагінацію/фільтри)

---

### 11) Додаткові задачі (NEXT)
- Backend: Замінити `createdById` у `task-logs/register` на значення з JWT у контролері (не з DTO) і передавати в сервіс через `RequestWithUser`.
- Backend: Забезпечити ідемпотентність інтеграції з інвентарем — додати унікальний індекс `InventoryLog(taskLogId)` та перевірку повторного створення логів.
- Backend: Оновити Swagger (опис нових параметрів `page`, `pageSize` у inventory/list і logs, endpoint `/inventory/units`).
- Backend: Перевірка проекту в `task-logs/register` — гарантувати відповідність `projectId` DTO до `task.projectId` і `part.projectId`.
- Frontend (web): Оновити клієнти API для inventory — передавати `page`, `pageSize`, обробляти `total`, `totalPages` у списку й логах.
- Frontend (web): Перевести UI на джерело юнітів з бекенда (`GET /inventory/units`) замість локального переліку; кешувати на провайдері.
- Frontend (web): У формі реєстрації задач додати вибір `part` (select) і поле `quantity` (за наявності) з відправкою `partId`. [DEPRECATED - замінено на Recipe System]
- Frontend (web): Покращити TaskRecipeEditor UI (Select замість Input, показ назв деталей, валідація) [DONE]
- Mobile (за потреби): Синхронізувати інтерфейси з web для пагінації та юнітів.
- DB Ops: Застосувати нові індекси (`Part(projectId, groupId)`, `InventoryLog(projectId, partId, createdAt DESC)`) на середовищах через міграції. [DONE]
- DB Ops: Усунути дрейф міграцій (baseline історії без зміни даних) АБО виконати reset+restore за наявності бекапу (єдине середовище). [DONE]
- Backend: Перевірити використання `Products.cost` у коді та Swagger; синхронізувати схему/міграції (покрити тестом міграції).

### 12) Продуктивність/Матеріалізація (NEXT)
- Backend: Додати таблицю `PartAggregate(projectId, partId, currentQuantity, updatedAt)` та оновлення в транзакції під час створення InventoryLog (інкрементально).
- Backend: Крон/джоб для перерахунку агрегатів (повний рефреш) за розкладом або за командою.
- Backend: Переключити звіти/списки на читання з агрегатів за наявності, з фолбеком на on-the-fly агрегацію.
