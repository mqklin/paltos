const path = require('path');
const spawn = require('child_process').spawn;

function start(endName) {
  const end = spawn('npm', ['start'], { cwd: path.join(__dirname, '..', endName) });
  end.stdout.on('data', function (data) {
    console.log(endName, 'stdout: ', data.toString());
  });

  end.stderr.on('data', function (data) {
    console.log(endName, 'stderr: ', data.toString());
  });

  end.on('exit', function (code) {
    console.log(endName, 'child process exited with code ', code.toString());
  });
}

start('frontend');
start('backend');
