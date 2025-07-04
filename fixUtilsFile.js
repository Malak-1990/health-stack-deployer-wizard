import fs from 'fs';
import path from 'path';

const utilsPath = path.resolve('src/lib/utils.ts');
const authPagePath = path.resolve('src/pages/AuthPage.tsx');

(async () => {
  if (!fs.existsSync(utilsPath)) {
    console.error('ملف utils.ts غير موجود في المسار src/lib/utils.ts');
    process.exit(1);
  }

  const utilsContent = await fs.promises.readFile(utilsPath, 'utf-8');

  const containsJSX = /<\s*[\w]+.*>/.test(utilsContent) || /return\s*\(/.test(utilsContent);

  if (!containsJSX) {
    console.log('ملف utils.ts لا يحتوي JSX، لا حاجة لنقله.');
    process.exit(0);
  }

  const cnMatch = utilsContent.match(/const cn\s*=\s*\([^)]+\)\s*=>\s*{[^}]+}/);

  let utilsNewContent = '';
  if (cnMatch) {
    utilsNewContent = cnMatch[0] + '\n\nexport { cn };';
  } else {
    utilsNewContent = '// ملف utils.ts يحتوي دوال مساعدة فقط، لا JSX هنا.';
  }

  await fs.promises.writeFile(authPagePath, utilsContent, 'utf-8');
  console.log(`تم نسخ محتوى utils.ts إلى ${authPagePath}`);

  await fs.promises.writeFile(utilsPath, utilsNewContent, 'utf-8');
  console.log(`تم تعديل utils.ts ليحتوي الدوال المساعدة فقط.`);

  console.log('انتهى التعديل بنجاح. لا تنسى تحديث استيراد AuthPage في ملفات مشروعك.');
})();