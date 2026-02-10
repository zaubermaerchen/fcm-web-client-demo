import './style.css'
import { getMessagingInstance, getVapidKey } from './firebase'
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging'

const statusEl = document.getElementById('status')
const tokenEl = document.getElementById('token')
const buttonEl = document.getElementById('request-permission') as HTMLButtonElement | null
const messageListEl = document.getElementById('message-list')

if (!statusEl || !tokenEl || !buttonEl || !messageListEl) {
  throw new Error('必要な要素がHTMLに見つかりません。')
}

const setStatus = (message: string, state: 'success' | 'error' | 'info' = 'info') => {
  statusEl.textContent = message
  statusEl.setAttribute('data-status', state)
}

const appendMessage = (payload: MessagePayload) => {
  const title = payload.notification?.title ?? '通知'
  const body = payload.notification?.body ?? JSON.stringify(payload.data ?? {})
  const listItem = document.createElement('li')
  listItem.textContent = `${title}: ${body}`
  messageListEl.prepend(listItem)
}

const ensureServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker に対応していないブラウザです。')
  }
  return navigator.serviceWorker.register('/firebase-messaging-sw.js')
}

const messagingPromise = getMessagingInstance().catch((error) => {
  console.error(error)
  setStatus(`初期化に失敗しました: ${error instanceof Error ? error.message : String(error)}`, 'error')
  return null
})

void messagingPromise.then((messaging) => {
  if (!messaging) {
    return
  }
  onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload)
    appendMessage(payload)
  })
})

const requestToken = async () => {
  if (!('Notification' in window)) {
    throw new Error('Notification API に対応していないブラウザです。')
  }

  setStatus('通知許可を確認中...')
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    setStatus('通知が許可されませんでした。', 'error')
    return
  }

  const messaging = await messagingPromise
  if (!messaging) {
    setStatus('このブラウザは FCM に対応していません。', 'error')
    return
  }

  const registration = await ensureServiceWorker()
  const token = await getToken(messaging, {
    vapidKey: getVapidKey(),
    serviceWorkerRegistration: registration
  })

  if (!token) {
    setStatus('トークンを取得できませんでした。', 'error')
    tokenEl.textContent = '未取得'
    return
  }

  console.log('FCM token:', token)
  tokenEl.textContent = token
  setStatus('トークンを取得しました。', 'success')
}

buttonEl.addEventListener('click', () => {
  buttonEl.disabled = true
  requestToken()
    .catch((error) => {
      console.error(error)
      setStatus(`エラー: ${error instanceof Error ? error.message : String(error)}`, 'error')
    })
    .finally(() => {
      buttonEl.disabled = false
    })
})
