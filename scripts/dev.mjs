import { spawn } from 'child_process';

const commands = [
  {
    label: 'server',
    command: 'npm',
    args: ['--prefix', 'server', 'run', 'dev'],
  },
  {
    label: 'client',
    command: 'npm',
    args: ['--prefix', 'client', 'run', 'dev'],
  },
];

const children = commands.map(({ label, command, args }) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${label} exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
