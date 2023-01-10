import { readFileSync } from 'node:fs'
import crypto from 'node:crypto'

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

const file = readFileSync('../file.txt', {
  encoding: 'utf8',
  flag: 'r',
})

export {
  publicKey,
  privateKey,
  verifyData,
  file,
}
