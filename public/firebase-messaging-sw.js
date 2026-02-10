importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')
importScripts('/firebase-config.js')

if (!self.__FIREBASE_CONFIG__) {
  console.error('firebase-config.js が読み込まれていません。')
} else {
  firebase.initializeApp(self.__FIREBASE_CONFIG__)

  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification ?? {}
    const title = notification.title || '新しい通知'
    const options = {
      body: notification.body || '',
      icon: '/vite.svg'
    }

    self.registration.showNotification(title, options)
  })
}
