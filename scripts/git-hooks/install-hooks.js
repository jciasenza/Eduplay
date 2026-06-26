const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const gitHookDir = path.join(repoRoot, '.git', 'hooks');
const commitHookPath = path.join(gitHookDir, 'post-commit');

const hookScript = `#!/bin/sh
# Auto append progress entry after commit
node ./scripts/update-progress.js "Auto: commit $(git rev-parse --short HEAD) - cambios realizados"
`;

try {
  if (!fs.existsSync(gitHookDir)) {
    console.warn('.git/hooks directory not found; skipping hook installation.');
    process.exit(0);
  }

  fs.writeFileSync(commitHookPath, hookScript, { mode: 0o755 });
  console.log('Installed post-commit hook to append progress entries.');
} catch (e) {
  console.error('Failed to install git hook:', e.message);
}
