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
  - Пагінація (опціонально на 2-й фазі) [NEXT]
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
  - Повертає історію рухів (базово без пагінації) [DONE] (пагінація [NEXT])
- Інтеграція з task-logs:
  - POST /task-logs/register — при наявності `partId` і `quantity` → створювати InventoryLog(type=PRODUCTION, quantity, partId, projectId, taskLogId) [NEXT]

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

UX деталі:
- Не показувати «0» там, де значення відсутнє (напр., targetQuantity)
- Стани завантаження/помилок з toast і плацхолдерами
- Респонсивна таблиця (стислі колонки на мобільному)

---

### 4) Інтеграція з реєстрацією задач
- У формі TaskRegister додати опцію «Прив’язати до деталі» (select part) для задач з `quantity`
- Після успішного сабміту та створення task_log — викликати бекенд для створення InventoryLog(type=PRODUCTION) з переданою `quantity`
- При видаленні task_log — компенсуючий ADJUSTMENT або видалення пов’язаного лог-запису (узгодити підхід)

Правила:
- Якщо `quantity` не вказано — логу не створюємо (або quantity=1 для певних типів задач, якщо так визначено процесом — потребує окремого рішення)

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
  - Part: (projectId, code) UNIQUE, (projectId, groupId)
  - InventoryLog: (projectId, partId, createdAt DESC)
- Міграції виконані для базових таблиць; поле `description` у Part — додано, потребує застосування міграції на середовищі [NEXT]

---

### 7) Аналітика/звіти (етап 2+)
- Перелік дефіцитних деталей (required > 0)
- Рухи за період з агрегацією по type
- ТОП дефіцитних деталей

---

### 8) Безпека та аудит
- InventoryLog — immutable (без редагування, лише нові коригуючі записи)
- Рольова модель як вище; логування дій (createdById)
-
- Project access guard: додати guard перевірки доступу до проєкту на всі inventory-ендпоїнти (аналог project-access.guard)
- createdById: проставляти з аутентифікованого користувача (JWT) під час створення InventoryLog
- Зв'язки: валідовувати відповідність partId проекту (part.projectId === :projectId) при створенні логів, відхиляти перехресні записи
  
Статус: guard-и і createdById — додано на ендпоінтах інвентаря [DONE]

---

### 9) Етапи впровадження
- Етап 1: Моделі/міграції + базові API (GET inventory, POST/PATCH parts) [DONE]
- Етап 2: UI список з групами + створення/редагування деталей [DONE]
- Етап 3: API логів + UI додавання/перегляду логів [DONE]
- Етап 4: Інтеграція з task-logs (автом. PRODUCTION) [NEXT]
- Етап 5: Звіти/фільтри/оптимізації (пагінація, індекси, кешування) [NEXT]

---

### 10) Ризики/застереження
- Узгодження unit та стандартизація
- Ідемпотентність при відкатах/повторних сабмітах
- Продуктивність на великих списках (вчасно додати пагінацію/фільтри)
