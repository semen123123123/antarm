import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const isWindows = process.platform === 'win32';

// On Windows, use cmd.exe to run npm commands
const server = spawn(
  isWindows ? 'cmd.exe' : 'npm',
  isWindows ? ['/c', 'npm', 'run', 'server:dev'] : ['run', 'server:dev'],
  { cwd: root, stdio: 'inherit' }
);

// Give server a head start
setTimeout(() => {
  const frontend = spawn(
    isWindows ? 'cmd.exe' : 'npm',
    isWindows ? ['/c', 'npm', 'run', 'dev:frontend'] : ['run', 'dev:frontend'],
    { cwd: root, stdio: 'inherit' }
  );

  frontend.on('close', (code) => {
    server.kill();
    process.exit(code);
  });
}, 1500);

server.on('close', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});

console.log('🚀 ANT ARM dev servers starting...');
console.log('   Backend:  http://localhost:3001');
console.log('   Frontend: http://localhost:3000');
