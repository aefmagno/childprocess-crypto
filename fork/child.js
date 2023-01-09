import { publicEncrypt } from 'node:crypto'

function encryptData(publicKey, file) {
  const buffer = Buffer.from(file, 'base64')
  return publicEncrypt(publicKey, buffer)
}

const parent = {}
process.on('message', (data) => {
  if (!parent.publicKey) {
    parent.publicKey = data.publicKey
    parent.file = data.file

    const encryptedData = encryptData(parent.publicKey, parent.file)
    process.send(encryptedData)
  }
})

process.on('SIGHUP', () => {
  process.exit(0)
})
