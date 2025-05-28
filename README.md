# goit-node-cli

Repository for the homework solution from the GoIT course 'Fullstack. Back End Development: Node.js', Topic 2: Creating Console Applications.

---

# "Тема 2. Створення консольних додатків"

## Завдання

Реалізувати консольний додаток для управління списком контактів з використанням Node.js та бібліотеки `commander`.

---

### Крок 1: Підготовка проекту

1. Створіть репозиторій з назвою `goit-node-cli`.
2. Ініціалізуйте npm-проект:

```bash
npm init -y
```

3. Встановіть залежність:

```bash
npm install commander
```

4. Скопіюйте структуру файлів з [папки src](https://github.com/goitacademy/neo-nodejs-homework/tree/main/hw1).

---

### Крок 2: Реалізація логіки (`contacts.js`)

```javascript
import fs from "fs/promises";
import path from "path";

// Шлях до файлу contacts.json
const contactsPath = path.join(process.cwd(), "src", "contacts.json");

async function listContacts() {
    // ...твій код
}

async function getContactById(contactId) {
    // ...твій код
}

async function removeContact(contactId) {
    // ...твій код
}

async function addContact(name, email, phone) {
    // ...твій код
}

export { listContacts, getContactById, removeContact, addContact };
```

---

### Крок 3: CLI-інтерфейс (`index.js`)

```javascript
import { program } from "commander";
import * as contacts from "./src/contacts.js";

program.command("list").action(async () => {
    const contactsList = await contacts.listContacts();
    console.table(contactsList);
});

program.parse(process.argv);
```

---

### Приклади використання

```bash
# Вивести всі контакти
node index.js -a list

# Знайти контакт по ID
node index.js -a get -i 05olLMgyVQdWRwgKfg5J6

# Додати контакт
node index.js -a add -n "John Doe" -e johndoe@example.com -p "(123) 456-7890"

# Видалити контакт
node index.js -a remove -i qdggE76Jtbfd9eWJHrssH
```

---

## Особливості даної реалізації

-   **Яскравий, інтуїтивний UX:**

    -   Всі повідомлення CLI (успіх, помилки, попередження, підказки) мають кольорове та стилізоване оформлення з використанням `chalk` та емодзі для інтуїтивного сприйняття.
    -   Ключові терміни (наприклад, відсутні поля, доступні дії) виділяються жирним або кольором для зручності користувача.

-   **Розширена валідація:**

    -   Валідація всіх вхідних даних (ім'я, email, телефон) з детальними підказками та підсвічуванням помилок.
    -   Всі перевірки винесені в окремий модуль для повторного використання та легкого тестування.
    -   Кожна деталь CLI орієнтована на зручність, зрозумілість та швидке виправлення помилок користувачем.

-   **Покращений вивід:**

    -   Всі результати (таблиці, повідомлення, заголовки) мають відповідне кольорове оформлення.
    -   Вивід списків та окремих контактів у вигляді таблиць з підписами.

-   **Централізована обробка помилок:**

    -   Всі помилки обробляються в одному місці з урахуванням контексту (тип помилки, місце виникнення).
    -   Вивід помилок завжди структурований, з підсвічуванням ключових слів та поясненням для користувача.

-   **Документований код:**

    -   Весь код містить JSDoc-коментарі та пояснення доступні навіть для junior-розробників.
    -   Всі функції мають приклади використання та опис параметрів.

-   **Сучасна архітектура:**
    -   ES-модулі, розділення на логічні частини (валідація, вивід, помилки, бізнес-логіка).
    -   Всі залежності та Node.js версія чітко визначені у `package.json`.
    -   Всі утиліти винесені в окремі модулі.
