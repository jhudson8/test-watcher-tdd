var clear = require('clear');
var chalk = require('chalk');
var spawn = require('child_process').spawn;

module.exports = function (options) {
  var runner = options.runner;
  var projectPath = options.projectPath;

  return function (fileData) {
    clear();

    var spawnOptions = runner.spawnOptions(fileData, options);
    try {
      var cmd = spawn(spawnOptions.exec, spawnOptions.params);
      cmd.stdout.on('data', function (data) {
        console.log(data.toString('utf8'));
      });
      cmd.stderr.on('data', function (data) {
        beep();
        console.log(chalk.red(data.toString('utf8')));
      });
      cmd.on('close', function (code) {
        if (code !== 0) {
          beep();
        }
      });
      cmd.on('error', function (code) {
        logSpawnError(spawnOptions);
      });
    } catch (e) {
      logSpawnError(spawnOptions);
    }
  }
};

function beep () {
  console.log('\007');
}

function clearScreen () {
  clear();
  console.log('========================');
  clear();
}

function logSpawnError(spawnOptions) {
  console.error('unable to spawn process "' + spawnOptions.exec + ' ' + (spawnOptions.params || []).join(' ') + '"');
}