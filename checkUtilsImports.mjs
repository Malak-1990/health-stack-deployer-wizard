import fs from 'fs/promises';
import path from 'path';

const ROOT_DIR = path.resolve('./src'); // مسار مجلد الكود
const UTILS_PATH = 'src/lib/utils'; // مسار ملف utils بدون الامتداد (يمكن تعديله)

async function getFiles(dir, ext = '.tsx') {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map(async (dirent) => {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) return getFiles(res, ext);
    else if (dirent.name.endsWith(ext) || dirent.name.endsWith('.ts')) return res;
    else return null;
  }));
  return files.flat().filter(Boolean);
}

async function checkImports() {
  const files = await getFiles(ROOT_DIR);

  console.log(`\n🔍 فحص ${files.length} ملف(ملفات) في مجلد src...`);

  const importRegex = new RegExp(`from ['"](${UTILS_PATH})(\\.ts|\\.tsx)?['"]`, 'i');
  const results = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    if (importRegex.test(content)) {
      results.push(file);
    }
  }

  if (results.length === 0) {
    console.log('✅ لا توجد استيرادات من utils.ts في ملفات src.');
  } else {
    console.log(`⚠️ وجدت استيرادات من utils.ts في ${results.length} ملف:`);
    results.forEach(f => console.log(' - ' + path.relative('.', f)));
    console.log('\n⚠️ تأكد من تحديث هذه الملفات للاستيراد الصحيح بعد تعديل utils.ts');
  }
}

checkImports().catch(err => {
  console.error('❌ حدث خطأ أثناء الفحص:', err);
});
