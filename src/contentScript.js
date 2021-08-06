import * as storage from './storage.js'
import { filterPronounceable } from './filterPronounceable.js'
import { transformMessage } from './transformMessage.js'

main()

function observeComments(target, callback) {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          continue
        }

        if (node.classList.contains('chat')) {
          const from = node.querySelector('.chat__contents__name').innerText
          const comment = node.querySelector(
            '.chat__contents__comment'
          ).innerText
          callback({ type: 'comment', from, comment })
        } else if (node.classList.contains('joinRoomChat')) {
          callback({ type: 'join', comment: node.innerText })
        } else if (node.classList.contains('likeChat')) {
          const from = node.querySelector(
            '.likeChat__inner__sendUserName'
          ).innerText
          callback({ type: 'like', from })
        } else if (node.classList.contains('yellChat')) {
          const from = node.querySelector(
            '.yellChat__inner__sendUserName'
          ).innerText
          const to = node.querySelector(
            '.yellChat__inner__getUserName'
          ).innerText
          callback({ type: 'yell', from, to })
        }
      }
    }
  })

  const observerOptions = {
    childList: true,
  }
  observer.observe(target, observerOptions)

  return () => {
    observer.disconnect
  }
}

function waitForFreeTalkChatContainer() {
  return new Promise((resolve) => {
    const check = () => {
      // Skip if user is in live
      if (!location.pathname.startsWith('/free/')) {
        setTimeout(check, 300)
        return
      }

      const chatContainer = document.querySelector(
        '.chatContainer__statusOpen__chat'
      )
      if (chatContainer) {
        resolve(chatContainer)
      } else {
        setTimeout(check, 300)
      }
    }
    check()
  })
}

function waitForElementRemoved(element) {
  return new Promise((resolve) => {
    const check = () => {
      if (element.isConnected) {
        setTimeout(check, 300)
      } else {
        resolve()
      }
    }
    check()
  })
}

function observeCountDown(callback) {
  setInterval(() => {
    const countDownMinutes = document.querySelector(
      '.headerCountDown .countDown__minutes'
    )
    const countDownSeconds = document.querySelector(
      '.headerCountDown .countDown__seconds'
    )
    if (!countDownMinutes || !countDownSeconds) {
      return
    }
    const minutes = parseInt(countDownMinutes.innerText, 10)
    const seconds = parseInt(countDownSeconds.innerText, 10)
    callback(minutes * 60 + seconds)
  }, 1000)
}

async function speak(message) {
  const muted = await storage.isMuted()
  if (!muted) {
    const transformedMessage = transformMessage(message)
    const pronounceableMessage = filterPronounceable(transformedMessage)
    const utterance = new SpeechSynthesisUtterance(pronounceableMessage)
    utterance.lang = 'ja-JP'
    utterance.volume = await storage.getVolume()
    utterance.pitch = await storage.getPitch()
    utterance.rate = await storage.getRate()
    speechSynthesis.speak(utterance)
  }
}

function speakTimes() {
  let previousSeconds = null
  observeCountDown((remainingSeconds) => {
    if (previousSeconds === remainingSeconds) {
      return
    }

    storage.isTimesEnabled().then((enabled) => {
      if (!enabled) {
        return
      }

      switch (remainingSeconds) {
        case 1200: // 20 miniutes
          speak('残り20分')
          break
        case 600: // 10 miniutes
          speak('残り10分')
          break
        case 300: // 5 miniutes
          speak('残り5分')
          break
        case 60: // 1 miniutes
          speak('残り1分')
          break
      }
    })

    previousSeconds = remainingSeconds
  })
}

async function speakComments(chatContainer) {
  let observedCount = 0
  let spokenCount = await storage.getSpokenCount()
  let spokenCountWritten = null

  const disconnect = observeComments(chatContainer, (payload) => {
    let message
    switch (payload.type) {
      case 'comment':
      case 'join':
        message = payload.comment
        break
      case 'like':
        message = `${payload.from}がいいねを送りました!`
        break
      case 'yell':
        message = `${payload.from}が${payload.to}にエール!`
        break
      default:
        message = ''
    }

    if (spokenCount <= observedCount) {
      speak(message)
      spokenCount++
      spokenCountWritten = storage.setSpokenCount(spokenCount)
    }

    observedCount++
  })

  await waitForElementRemoved(chatContainer)

  if (spokenCountWritten) {
    await spokenCountWritten
  }

  disconnect()
}

async function main() {
  for (;;) {
    const chatContainer = await waitForFreeTalkChatContainer()

    if (location.pathname.startsWith('/free/stage/')) {
      const previousPathname = await storage.getPreviousPathname()
      if (previousPathname !== location.pathname) {
        await storage.setPreviousPathname(location.pathname)
        await storage.setSpokenCount(0)
        speakTimes()
      }
    }

    await speakComments(chatContainer)
  }
}
