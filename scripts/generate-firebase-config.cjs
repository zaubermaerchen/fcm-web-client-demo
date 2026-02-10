const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const envPath = path.join(projectRoot, '.env')

const parseEnv = (content) => {
  const env = {}
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }
    const match = trimmed.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/)
    if (!match) {
      return
    }
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[match[1]] = value
  })
  return env
}

const fileEnv = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, 'utf8')) : {}

const getEnvValue = (key) => process.env[key] ?? fileEnv[key] ?? ''

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
]

const missing = required.filter((key) => !getEnvValue(key))
if (missing.length) {
  console.error(`Missing Firebase env vars: ${missing.join(', ')}`)
  process.exit(1)
}

const config = {
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvValue('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvValue('VITE_FIREBASE_APP_ID')
}

const output = `self.__FIREBASE_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`
const outputPath = path.join(projectRoot, 'public', 'firebase-config.js')
fs.writeFileSync(outputPath, output)
console.log('Generated public/firebase-config.js')
