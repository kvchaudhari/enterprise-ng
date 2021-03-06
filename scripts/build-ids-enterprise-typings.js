#!/usr/bin/env node

/**
 * @fileoverview Copies the typingsfrom the projects folderro the dist folder.
 * @example `node ./scripts/build-ids-enterprise-typings.js`
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const fs = require("fs-extra");
const slash = require("slash");

// -------------------------------------
//   Constants
// -------------------------------------
const rootPath = slash(process.cwd());
const libTypingsPath = `${rootPath}/projects/ids-enterprise-typings`;
const distTypingpath = `${rootPath}/dist/ids-enterprise-typings`;

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Log a colorful message
 * @param {string} action - An action word
 * @param {string} msg - the message
 */
const logAction = (action, msg) => {
  console.log(chalk.cyan(action), msg, "\n");
};

/**
 * Log a colorful error message
 * @param {string} msg - the message
 */
const logError = (msg) => {
  console.log(chalk.red("Error!"), msg, "\n");
};

/**
 * Executes the command on the cli
 * @param {string} cmd - The command
 */
function executeUpdate(cmd) {
  const exec = require("child_process").exec;
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      logError(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}

// -------------------------------------
//   Main
// -------------------------------------

fs.copy(libTypingsPath, distTypingpath, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`copied typings to ${distTypingpath}`);
  }
});
