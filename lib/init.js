#!/usr/bin/env node

const { promisify } = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')
const { clone } = require('./download')
const ora = require('ora')

const mySpawn = async (...args) => {
    const { spawn } = require('child_process')
    const options = args[args.length - 1]
    if (process.platform === 'win32') {
        options.shell = true
    }

    return new Promise(resolve => {
        const proc = spawn(...args)
        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
        proc.on('close', () => [
            resolve()
        ])
    })
}

const log = content => console.log(chalk.green(content))

module.exports = async name => {
    // 欢迎画面
    clear()
    const data = await figlet('DZJ Welcome')
    log(data)

    log(`🚀   create project：${name}`)

    // 克隆代码
    await clone('github:Mizxinp/react-template#main', name)
    log('install dependencies')

    // 安装依赖
    const process = ora('install dependencies.....')
    process.start()
    await mySpawn('npm', ['install'], { cwd: `./${name}` })
    process.succeed()

        log(`
    👌 install finished：
    To get Start:
    ===========================
        cd ${name}
        yarn run dev
    ===========================
         `)
}