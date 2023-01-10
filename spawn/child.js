import { publicEncrypt } from 'node:crypto'

function encryptData(publicKey, file) {
  const buffer = Buffer.from(file, 'base64')
  return publicEncrypt(publicKey, buffer)
}

process.stdin.on('data', (data) => {
  const { publicKey, file } = JSON.parse(data)

  const encryptedData = encryptData(publicKey, file)
  process.stdout.write(encryptedData)
})

process.on('SIGHUP', () => {
  process.exit(0)
})
