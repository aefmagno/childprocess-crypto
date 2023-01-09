import crypto from 'node:crypto'
import { fork } from 'node:child_process'
import { readFileSync } from 'node:fs'

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
})

function verifyData(data) {
  const buffer = Buffer.from(data, 'base64')
  const algo = 'SHA256'

  const signature = crypto.sign(algo, buffer, privateKey)
  return crypto.verify(algo, buffer, publicKey, signature)
}

const child = fork('./child.js')

const file = readFileSync('../file.txt', {
  encoding: 'utf8',
  flag: 'r',
})

child.send({ publicKey, file })

const result = {}

child.on('message', (data) => {
  const verify = verifyData(data)
  if (verify) {
    result.verify = 'The signature is verified'
    result.memoryUsage = process.memoryUsage().heapUsed

    process.kill(child.pid, 'SIGHUP')
    result.executionTime = process.uptime()

    console.table(result)
  } else {
    throw new Error('The signature is not verified')
  }
})
