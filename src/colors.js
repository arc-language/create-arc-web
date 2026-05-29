'use strict'

const tty = process.stdout.isTTY
const RED   = tty ? '\x1b[31m' : ''
const GREEN = tty ? '\x1b[32m' : ''
const CYAN  = tty ? '\x1b[36m' : ''
const DIM   = tty ? '\x1b[2m'  : ''
const RESET = tty ? '\x1b[0m'  : ''

module.exports = { RED, GREEN, CYAN, DIM, RESET }
