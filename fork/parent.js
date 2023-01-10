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
  } else {
    process.kill(child.pid, 'SIGHUP')
    result.verify = 'The signature is verified'
    result.memoryUsage = process.memoryUsage().external
    result.executionTime = process.uptime()
    console.table(result)
  }
})
