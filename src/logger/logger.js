const path = require('path');
const fs = require('fs');
const LOG_DIR = path.join(__dirname, '../../logs'); // You can change the path
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const FILE_PREFIX = 'log';
const FILE_EXTENSION = '.txt';

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getNextLogFile() {
  let index = 1;
  let filePath = path.join(LOG_DIR, `${FILE_PREFIX}${index}${FILE_EXTENSION}`);
  while (fs.existsSync(filePath) && fs.statSync(filePath).size >= MAX_SIZE) {
    index++;
    filePath = path.join(LOG_DIR, `${FILE_PREFIX}${index}${FILE_EXTENSION}`);
  }
  return filePath;
}

function writeToFile(logLine) {
  const filePath = getNextLogFile();
  fs.appendFileSync(filePath, logLine + '\n', 'utf8');
}

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  dim: '\x1b[2m',
  bold: '\x1b[1m'
};

function getCallerInfo() {
  const stack = new Error().stack.split('\n');
  
  // Skip the first few lines (Error constructor, getCallerInfo, logMessage functions)
  for (let i = 3; i < stack.length; i++) {
    const line = stack[i];
    const match = line.match(/\((.*):(\d+):(\d+)\)/);
    if (match) {
      const filePath = match[1];
      const lineNumber = match[2];
      const columnNumber = match[3];
      
      // Skip if it's the logger file itself
      if (!filePath.includes('logger.js')) {
        // Return full path and line number
        return `${filePath}:${lineNumber}:${columnNumber}`;
      }
    }
  }
  return 'unknown';
}

function getTime() {
  return new Date().toISOString();
}

function logMessageINFO(type, colorCode, ...args) {
  const time = getTime();
  const caller = getCallerInfo();
  const label = `${COLORS.bold}[${type.toUpperCase()}]${COLORS.reset}`;
  const timestamp = `${COLORS.dim}${time}${COLORS.reset}`;
  const location = `${COLORS.gray}${caller}${COLORS.reset}`;
  const message = args.join(' ');
  const finalMessage = `${colorCode}${label}${COLORS.reset} ${timestamp} ${location} - ${COLORS.gray}${message}${COLORS.reset}`;
  console.log(finalMessage);
  writeToFile(finalMessage);
}

function logMessageSUCCESS(type, colorCode, ...args) {
    const time = getTime();
    const caller = getCallerInfo();
    const label = `${COLORS.bold}[${type.toUpperCase()}]${COLORS.reset}`;
    const timestamp = `${COLORS.dim}${time}${COLORS.reset}`;
    const location = `${COLORS.gray}${caller}${COLORS.reset}`;
    const message = args.join(' ');
    const finalMessage = `${colorCode}${label}${COLORS.reset} ${timestamp} ${location} - ${COLORS.green}${message}${COLORS.reset}`;
    console.log(finalMessage);
    writeToFile(finalMessage);
}

function logMessageERROR(type, colorCode, ...args) {
    const time = getTime();
    const caller = getCallerInfo();
    const label = `${COLORS.bold}[${type.toUpperCase()}]${COLORS.reset}`;
    const timestamp = `${COLORS.dim}${time}${COLORS.reset}`;
    const location = `${COLORS.gray}${caller}${COLORS.reset}`;
    const message = args.join(' ');
    const finalMessage = `${colorCode}${label}${COLORS.reset} ${timestamp} ${location} - ${COLORS.red}${message}${COLORS.reset}`;
    console.log(finalMessage);
    writeToFile(finalMessage);
}

function logMessageWARN(type, colorCode, ...args) {
    const time = getTime();
    const caller = getCallerInfo();
    const label = `${COLORS.bold}[${type.toUpperCase()}]${COLORS.reset}`;
    const timestamp = `${COLORS.dim}${time}${COLORS.reset}`;
    const location = `${COLORS.gray}${caller}${COLORS.reset}`;
    const message = args.join(' ');
    const finalMessage = `${colorCode}${label}${COLORS.reset} ${timestamp} ${location} - ${COLORS.yellow}${message}${COLORS.reset}`;
    console.log(finalMessage);
    writeToFile(finalMessage);
}

function logMessageACK(type, colorCode, ...args) {
    const time = getTime();
    const caller = getCallerInfo();
    const label = `${COLORS.bold}[${type.toUpperCase()}]${COLORS.reset}`;
    const timestamp = `${COLORS.dim}${time}${COLORS.reset}`;
    const location = `${COLORS.gray}${caller}${COLORS.reset}`;
    const message = args.join(' ');
    const finalMessage = `${colorCode}${label}${COLORS.reset} ${timestamp} ${location} - ${COLORS.magenta}${message}${COLORS.reset}`;
    console.log(finalMessage);
    writeToFile(finalMessage);
}

// Logger methods
const logger = {
  info: (...args) => logMessageINFO('info', COLORS.blue, ...args),
  success: (...args) => logMessageSUCCESS('success', COLORS.green, ...args),
  error: (...args) => logMessageERROR('error', COLORS.red, ...args),
  warn: (...args) => logMessageWARN('warn', COLORS.yellow, ...args),
  ack: (...args) => logMessageACK('ack', COLORS.magenta, ...args),
};

module.exports = logger;
