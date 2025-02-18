import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function distIcons() {
  try {
    await execAsync('rm -rf dist/icons');
    await execAsync('mkdir -p dist/icons/svgs');
    await execAsync('cp -r icons/svgs/ dist/icons/svgs');
    await execAsync('cp -r icons/package/* dist/icons');
    console.log('Icons copied successfully!\n');
  } catch (error) {
    console.error('Error running icons-dist:', error);
  }
}

distIcons();
