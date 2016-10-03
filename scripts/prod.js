const spawn = require('child_process').spawn;
const path = require('path');

const spawns = [
  ['npm', ['run', 'build'], { cwd: path.join(__dirname, '..', 'frontend') }],
  ['rm', ['-rf', 'prod'], { cwd: path.join(__dirname, '..') }],
  ['mkdir', ['prod'], { cwd: path.join(__dirname, '..') }],
  ['mv', ['frontend/build', './prod'], { cwd: path.join(__dirname, '..') }],
  ['cp', ['index.html', '../prod/build'], { cwd: path.join(__dirname, '..', 'frontend') }],
  ['cp', ['favicon.png', '../prod/build'], { cwd: path.join(__dirname, '..', 'frontend') }],
  ['npm', ['run', 'build'], { cwd: path.join(__dirname, '..', 'backend') }],
  ['mv', ['backend.js', '../prod'], { cwd: path.join(__dirname, '..', 'backend') }],
];

function connectSpawn(s, cb, i) {
  s.stdout.on('data', function (data) {
    console.log('stdout: ', data.toString());
  });

  s.stderr.on('data', function (data) {
    console.log('stderr: ', data.toString());
    process.exit();
  });

  s.on('exit', function (code) {
    console.log('child process #', i, 'of', spawns.length, 'exited with code ', code.toString());
    cb();
  });
}



if (process.env.DEPLOY !== 'true') spawns.push(['node', ['backend.js'], { cwd: path.join(__dirname, '..', 'prod') }]);

function f(i) {
  if (i === spawns.length) return;
  connectSpawn(
    spawn.apply(null, spawns[i]),
    function() { f(i+1) },
    i
  );
}

f(0);


