const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const taskPath = path.join(repoRoot, 'task.md');
const progressPath = path.join(repoRoot, 'PROGRESS.md');

function readSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return '';
  }
}

const msg = process.argv.slice(2).join(' ').trim();
if (!msg) {
  console.log('Usage: node scripts/update-progress.js "Your progress message here"');
  process.exit(0);
}

const date = new Date().toLocaleString('es-ES');
let header = '';
if (!fs.existsSync(progressPath)) {
  header = `# Documentación de progreso de Aventuras del Saber\n\n`; 
  fs.writeFileSync(progressPath, header, 'utf8');
}

const entry = `### ${date}\n\n- ${msg}\n\n`;
fs.appendFileSync(progressPath, entry, 'utf8');
console.log('PROGRESS.md actualizado (entrada anexada).');