/**
 * export-icons.mjs
 *
 * Скачивает все иконки из Figma Component Sets с правильными именами.
 * Читает пропсы Size и Theme каждого варианта → называет файл соответственно.
 *
 * Использование:
 *   node export-icons.mjs
 *
 * Зависимости (установи перед запуском):
 *   npm install node-fetch dotenv
 *
 * Переменные окружения (.env):
 *   FIGMA_TOKEN=your_personal_access_token
 *   FIGMA_FILE_ID=your_file_id
 *   FIGMA_PAGE_NAME=Icons   ← имя страницы с иконками (опционально)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Конфиг ───────────────────────────────────────────────────────────────────

// Загружаем .env если есть
try {
  const env = fs.readFileSync(".env", "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {}

const TOKEN   = process.env.FIGMA_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID;
const PAGE    = process.env.FIGMA_PAGE_NAME || null; // null = все страницы

const OUTPUT_DIR = "./src/icons";

// Маппинг пропсов → части имени файла
// Подстрой если у тебя пропсы называются иначе
const SIZE_PROP  = "Size";
const THEME_PROP = "Theme";

// ─── Валидация ─────────────────────────────────────────────────────────────────

if (!TOKEN || !FILE_ID) {
  console.error(`
❌ Не заданы переменные окружения.

Создай файл .env рядом со скриптом:
  FIGMA_TOKEN=your_personal_access_token
  FIGMA_FILE_ID=xxxxxxxxxxxxxxxxxxxxxx
  FIGMA_PAGE_NAME=Icons
`);
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const figmaFetch = (endpoint) =>
  fetch(`https://api.figma.com/v1${endpoint}`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((r) => {
    if (!r.ok) throw new Error(`Figma API ${r.status}: ${r.statusText}`);
    return r.json();
  });

/** kebab-case из любой строки */
const toKebab = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Рекурсивно собирает ноды по предикату */
const findNodes = (node, predicate, results = []) => {
  if (predicate(node)) results.push(node);
  if (node.children) node.children.forEach((c) => findNodes(c, predicate, results));
  return results;
};

/** Скачивает файл по URL и сохраняет */
const downloadFile = async (url, filePath) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));
};

/** Заменяет хардкодные цвета на currentColor и убирает width/height */
const cleanSvg = (svgContent) =>
  svgContent
    .replace(/ width="[^"]*"/g, "")
    .replace(/ height="[^"]*"/g, "")
    .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"')
    .replace(/fill="black"/g, 'fill="currentColor"')
    .replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, 'stroke="currentColor"');

// ─── Основная логика ──────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔌 Подключаемся к Figma API...");

  // 1. Получаем структуру файла
  const fileData = await figmaFetch(`/files/${FILE_ID}`);
  console.log(`📄 Файл: ${fileData.name}`);

  // 2. Фильтруем страницы
  let pages = fileData.document.children;
  if (PAGE) {
    pages = pages.filter((p) => p.name === PAGE);
    if (!pages.length) {
      console.error(`❌ Страница "${PAGE}" не найдена.`);
      console.log("Доступные страницы:", fileData.document.children.map((p) => p.name).join(", "));
      process.exit(1);
    }
  }

  // 3. Ищем все COMPONENT_SET ноды
  const componentSets = [];
  for (const page of pages) {
    const sets = findNodes(page, (n) => n.type === "COMPONENT_SET");
    componentSets.push(...sets);
  }

  console.log(`\n🔍 Найдено Component Sets: ${componentSets.length}`);

  if (!componentSets.length) {
    console.error("❌ Component Sets не найдены. Проверь имя страницы или структуру файла.");
    process.exit(1);
  }

  // 4. Из каждого Component Set вытаскиваем все варианты (COMPONENT ноды)
  const variants = []; // { id, name, iconName, size, theme }

  for (const set of componentSets) {
    const iconBaseName = toKebab(set.name);

    const components = findNodes(set, (n) => n.type === "COMPONENT");

    for (const component of components) {
      // componentProperties содержит пропсы варианта
      // Парсим из имени компонента (формат: "Size=24, Theme=Regular")
      const props = {};
      component.name.split(",").forEach((part) => {
        const [k, v] = part.split("=").map((s) => s.trim());
        if (k && v) props[k] = v;
      });

      const size  = props[SIZE_PROP]  || "24";
      const theme = props[THEME_PROP] || "regular";

      const fileName = `${iconBaseName}_${size}_${toKebab(theme)}.svg`;

      variants.push({
        id: component.id,
        iconName: iconBaseName,
        size,
        theme,
        fileName,
      });
    }
  }

  console.log(`🎨 Вариантов для экспорта: ${variants.length}`);

  // 5. Получаем URL для скачивания SVG
  // Figma API принимает максимум ~300 id за раз — делим на батчи
  const BATCH_SIZE = 200;
  const urlMap = {};

  for (let i = 0; i < variants.length; i += BATCH_SIZE) {
    const batch = variants.slice(i, i + BATCH_SIZE);
    const ids = batch.map((v) => v.id).join(",");

    console.log(`\n⏳ Запрашиваем URL для батча ${Math.floor(i / BATCH_SIZE) + 1}...`);

    const imagesData = await figmaFetch(
      `/images/${FILE_ID}?ids=${ids}&format=svg&svg_include_id=false&svg_simplify_stroke=true`
    );

    if (imagesData.err) {
      console.error("❌ Ошибка от Figma:", imagesData.err);
      process.exit(1);
    }

    Object.assign(urlMap, imagesData.images);
  }

  // 6. Скачиваем SVG файлы
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\n⬇️  Скачиваем SVG в ${OUTPUT_DIR}/\n`);

  let downloaded = 0;
  let failed = 0;

  // Скачиваем параллельно по 10 за раз
  const PARALLEL = 10;

  for (let i = 0; i < variants.length; i += PARALLEL) {
    const batch = variants.slice(i, i + PARALLEL);

    await Promise.all(
      batch.map(async (variant) => {
        const url = urlMap[variant.id];
        if (!url) {
          console.warn(`  ⚠️  Нет URL для: ${variant.fileName}`);
          failed++;
          return;
        }

        const filePath = path.join(OUTPUT_DIR, variant.fileName);

        try {
          // Скачиваем и чистим SVG
          const res = await fetch(url);
          const rawSvg = await res.text();
          const cleanedSvg = cleanSvg(rawSvg);
          fs.writeFileSync(filePath, cleanedSvg, "utf8");

          console.log(`  ✓ ${variant.fileName}`);
          downloaded++;
        } catch (err) {
          console.error(`  ✗ ${variant.fileName}: ${err.message}`);
          failed++;
        }
      })
    );
  }

  // 7. Итог
  console.log(`
─────────────────────────────────────
✅ Готово!

  Скачано:  ${downloaded} файлов
  Ошибок:   ${failed}
  Папка:    ${OUTPUT_DIR}/

Следующий шаг:
  npx @svgr/cli --out-dir src/components/Icon/icons --typescript src/icons
─────────────────────────────────────
`);
}

main().catch((err) => {
  console.error("\n❌ Ошибка:", err.message);
  process.exit(1);
});
