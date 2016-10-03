const spawn = require('child_process').spawn;
const path = require('path');
const password = require('./data').password;
const ip = require('./data').ip;

const s = spawn(
  'sshpass',
  ['-p', password, 'scp', '-r', '.', 'maksim@' + ip + ':/home/maksim/www'],
  { cwd: path.join(__dirname, '..', 'prod') }
);

s.stdout.on('data', function (data) {
  console.log('stdout: ', data.toString());
});

s.stderr.on('data', function (data) {
  console.log('stderr: ', data.toString());
});

s.on('exit', function (code) {
  console.log('child process exited with code ', code.toString());
});
