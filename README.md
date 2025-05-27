# 🚀 Розширені Специфікації для "goit-node-cli"

Цей документ доповнює основні вимоги з `README.md` розширеними можливостями та стандартами якості.

**⚖️ Принцип збалансованості:** Додатковий код ≤ 40% від основного функціоналу

## 🌟 Ключові Покращення

### 1. Сучасна Архітектура

```json
{
    "name": "goit-node-cli",
    "version": "1.0.0",
    "type": "module",
    "engines": { "node": ">=18.0.0" },
    "dependencies": {
        "commander": "^11.0.0",
        "chalk": "^5.3.0",
        "uuid": "^9.0.1"
    }
}
```

**Переваги:**

-   ES-модулі замість CommonJS
-   Чітке визначення версій Node.js

---

### 2. Валідація Даних

**Код для валідації в `src/utils/validation.js`:**

```javascript
/**
 * Валідує дані контакту перед збереженням
 *
 * Ця функція перевіряє коректність всіх обов'язкових полів контакту.
 * Повертає null якщо валідація успішна, або масив помилок.
 *
 * @param {Object} contact - Об'єкт контакту для валідації
 * @param {string} contact.name - Ім'я контакту
 * @param {string} contact.email - Email контакту
 * @param {string} contact.phone - Телефон контакту
 * @returns {Array<string>|null} Масив помилок або null якщо все ОК
 *
 * @example
 * const errors = validateContact({ name: "Іван", email: "ivan@test.com", phone: "123-45-67" });
 * if (errors) {
 *   console.log("Помилки:", errors.join(", "));
 * }
 */
export const validateContact = (contact) => {
    const errors = [];

    // Перевіряємо наявність та непустоту імені
    if (!contact.name?.trim()) {
        errors.push("Ім'я обов'язкове");
    }

    // Базова перевірка email (має містити @ та крапку)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        errors.push("Невірний формат email");
    }

    // Перевірка формату телефону XXX-XX-XX
    if (!/^\d{3}-\d{2}-\d{2}$/.test(contact.phone)) {
        errors.push("Телефон у форматі XXX-XX-XX");
    }

    // Повертаємо null якщо помилок немає, інакше масив помилок
    return errors.length ? errors : null;
};
```

**LLM-підказка:** Функція повертає `null` при успішній валідації або масив помилок. Використовуйте її перед записом у файл.

---

### 3. Покращений UX з кольоровим виводом

**Створіть `src/utils/output.js`:**

```javascript
/**
 * Утиліти для кольорового виводу в консоль
 *
 * Цей модуль надає зручні функції для виводу повідомлень різних типів
 * з відповідним кольоровим форматуванням для покращення UX.
 */
import chalk from "chalk";

// Експортуємо об'єкт з методами для різних типів повідомлень
export const log = {
    // Зелений колір для успішних операцій
    success: (msg) => console.log(chalk.green(`✓ ${msg}`)),

    // Червоний колір для помилок
    error: (msg) => console.log(chalk.red(`✗ ${msg}`)),

    // Синій колір для інформаційних повідомлень
    info: (msg) => console.log(chalk.blue(`ℹ ${msg}`)),

    // Жовтий колір для попереджень
    warning: (msg) => console.log(chalk.yellow(`⚠ ${msg}`)),
};
```

**Приклад використання в index.js:**

```javascript
import { log } from "./utils/output.js";

// Успішна операція
log.success("Контакт додано!");

// Помилка
log.error("Невірний формат email");

// Інформація
log.info("Список контактів:");
```

---

### 4. Обробка Помилок

**Централізований обробник в `src/utils/errorHandler.js`:**

```javascript
/**
 * Централізований обробник помилок для CLI застосунку
 *
 * Ця функція обробляє різні типи помилок та виводить зрозумілі повідомлення
 * користувачу, після чого коректно завершує програму.
 *
 * @param {Error} error - Об'єкт помилки для обробки
 */
import chalk from "chalk";

export const handleError = (error) => {
    // Обробляємо різні типи помилок
    if (error.code === "ENOENT") {
        console.error(chalk.red("✗ Файл не знайдено"));
    } else if (error.code === "EACCES") {
        console.error(chalk.red("✗ Недостатньо прав доступу"));
    } else if (error instanceof SyntaxError) {
        console.error(chalk.red("✗ Файл contacts.json пошкоджено"));
    } else {
        console.error(chalk.red(`✗ ${error.message}`));
    }

    // Завершуємо програму з кодом помилки
    process.exit(1);
};

// Використання:
try {
    await addContact(name, email, phone);
} catch (err) {
    handleError(err);
}
```

---

## 🛠️ Рекомендована Структура Проєкту

```text
goit-node-cli/
├── src/
│   ├── utils/           # Допоміжні функції
│   │   ├── validation.js    # Валідація даних
│   │   ├── output.js        # Кольоровий вивід
│   │   └── errorHandler.js  # Обробка помилок
│   ├── contacts.js      # Бізнес-логіка роботи з контактами
│   └── index.js         # Точка входу програми
├── contacts.json        # Дані контактів (створюється автоматично)
├── .gitignore
├── package.json
└── README.md
```

---

## 📋 Критерії Якості

| Категорія     | Обов'язково            | Рекомендовано            |
| ------------- | ---------------------- | ------------------------ |
| **Код**       | ES-модулі, async/await | JSDoc, Prettier          |
| **Валідація** | Базові перевірки       | Регулярні вирази         |
| **UX**        | Кольоровий вивід       | Детальні повідомлення    |
| **Помилки**   | Try/Catch              | Централізований обробник |

---

## 🚀 Приклади Використання

```bash
# Додати контакт (з валідацією)
node src/index.js add --name "Анна" --email anna@example.com --phone "123-45-67"

# Вивести список (з кольорами)
node src/index.js list

# Отримати контакт за ID
node src/index.js get --id "abc123"

# Видалити контакт
node src/index.js remove --id "abc123"
```

## 💡 Поради для Реалізації

1. **Почніть з основного функціоналу** - спочатку реалізуйте базові CRUD операції
2. **Поступово додавайте поліпшення** - валідацію, кольори, кращу обробку помилок
3. **Тестуйте кожну зміну** - переконайтеся, що основний функціонал працює
4. **Дотримуйтесь принципу KISS** - не ускладнюйте без потреби

**Пам'ятайте:** Мета - створити функціональний та якісний CLI застосунок, а не продемонструвати знання всіх можливих технологій.
