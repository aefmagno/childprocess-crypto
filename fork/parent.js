import { fork } from 'node:child_process'

import {
  publicKey,
  verifyData,
  file,
} from '../helper.js'

const child = fork('./child.js')

child.send({ publicKey, file })

const result = {}

child.on('message', (data) => {
  const verify = verifyData(data)
  if (verify) {
    result.verify = 'The signature is verified'
    result.memoryUsage = process.memoryUsage().external

    process.kill(child.pid, 'SIGHUP')
    result.executionTime = process.uptime()
    console.table(result)
    process.exit()
  } else {
    result.verify = 'The signature is verified'
    result.memoryUsage = process.memoryUsage().external
    result.executionTime = process.uptime()
    console.table(result)
    process.kill(child.pid, 'SIGHUP')
  }
})

process.stderr.on('data', (err) => {
  console.log(err)
})

process.on('error', (err) => {
  console.log(err)
})
