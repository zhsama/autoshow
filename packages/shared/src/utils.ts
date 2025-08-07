// src/utils.ts

import { Buffer } from 'node:buffer'
import { exec, execFile, spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  access,
  readdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from 'node:fs/promises'
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path'
import { argv, env, exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import chalk from 'chalk'

export const execPromise = promisify(exec)
export const execFilePromise = promisify(execFile)

function createChainableLogger(baseLogger: (...args: any[]) => void) {
  const logger = (...args: any[]) => baseLogger(...args)
  const styledLogger = Object.assign(logger, {
    step: (...args: any[]) => baseLogger(chalk.bold.underline(...args)),
    dim: (...args: any[]) => baseLogger(chalk.dim(...args)),
    success: (...args: any[]) => baseLogger(chalk.bold.blue(...args)),
    warn: (...args: any[]) => baseLogger(chalk.bold.yellow(...args)),
    opts: (...args: any[]) => baseLogger(chalk.magentaBright.bold(...args)),
    info: (...args: any[]) => baseLogger(chalk.magentaBright.bold(...args)),
    wait: (...args: any[]) => baseLogger(chalk.bold.cyan(...args)),
    final: (...args: any[]) => baseLogger(chalk.bold.italic(...args)),
  })
  return styledLogger
}

export const l = createChainableLogger(console.log)
export const err = createChainableLogger(console.error)

export {
  access,
  argv,
  basename,
  Buffer,
  dirname,
  env,
  exec,
  execFile,
  existsSync,
  exit,
  extname,
  fileURLToPath,
  isAbsolute,
  join,
  mkdirSync,
  readdir,
  readFile,
  readFileSync,
  relative,
  rename,
  resolve,
  spawn,
  unlink,
  writeFile,
  writeFileSync,
}
