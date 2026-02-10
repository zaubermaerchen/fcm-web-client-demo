import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'

const getEnvValue = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。`)
  }
  return value
}

const buildFirebaseConfig = () => ({
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvValue('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvValue('VITE_FIREBASE_APP_ID')
})

let app: FirebaseApp | null = null

const getApp = () => {
  if (!app) {
    app = initializeApp(buildFirebaseConfig())
  }
  return app
}

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (!(await isSupported())) {
    return null
  }
  return getMessaging(getApp())
}

export const getVapidKey = () => getEnvValue('VITE_FIREBASE_VAPID_KEY')
