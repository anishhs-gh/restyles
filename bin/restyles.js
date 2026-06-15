#!/usr/bin/env node
const cmd = process.argv[2];

if (cmd === 'build') {
  import('../src/cli/build.js');
} else {
  console.log('ReStyles CLI');
  console.log('');
  console.log('Usage:');
  console.log('  restyles build   Generate _site/ from restyles.config.json');
  if (cmd) {
    console.error(`\nUnknown command: ${cmd}`);
    process.exit(1);
  }
}
