import { spawn } from 'node:child_process'
import {
  publicKey,
  verifyData,
  file,
} from '../helper.js'

const child = spawn('node', ['child.js'])

const json = JSON.stringify({ publicKey, file })
child.stdin.write(json)

const result = {}

child.stdout.on('data', (data) => {
  const verify = verifyData(data)
  if (verify) {
    result.verify = 'The signature is verified'
    result.memoryUsage = process.memoryUsage().external

    process.kill(child.pid, 'SIGHUP')
    result.executionTime = process.uptime()

    console.table(result)
  } else {
    result.verify = 'The signature is verified'
    result.memoryUsage = process.memoryUsage().external
    result.executionTime = process.uptime()
    console.table(result)
  }
})
