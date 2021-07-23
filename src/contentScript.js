import * as storage from './storage.js'
import { filterPronounceable } from './filterPronounceable.js'
import { transformMessage } from './transformMessage.js'

let chatCount = 0

main()

function observeComments(target, callback) {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type !== 'childList') {
        continue
      }

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
}

function waitForChatContainer() {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationList) => {
      if (!location.pathname.startsWith('/free/stage/')) {
        return
      }

      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') {
          continue
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          if (node.classList.contains('chatContainer__statusOpen__chat')) {
            resolve(node)
            observer.disconnect()
            return
          }

          const chatContainer = document.querySelector(
            '.chatContainer__statusOpen__chat'
          )
          if (chatContainer) {
            resolve(chatContainer)
            observer.disconnect()
            return
          }
        }
      }
    })

    const observerOptions = {
      childList: true,
      subtree: true,
    }

    observer.observe(document.documentElement, observerOptions)
  })
}

async function speak(message) {
  const spokenCount = await storage.getSpokenCount()
  if (chatCount < spokenCount) {
    return
  }

  const isMuted = await storage.getMuted()
  if (!isMuted) {
    const pronounceableMessage = filterPronounceable(message)
    const transformedMessage = transformMessage(pronounceableMessage)
    const utterance = new SpeechSynthesisUtterance(transformedMessage)
    utterance.lang = 'ja-JP'
    utterance.volume = await storage.getVolume()
    utterance.pitch = await storage.getPitch()
    utterance.rate = await storage.getRate()
    speechSynthesis.speak(utterance)
  }

  await storage.setSpokenCount(spokenCount + 1)
}

async function main() {
  let chatContainer = document.querySelector('.chatContainer__statusOpen__chat')
  if (!chatContainer) {
    chatContainer = await waitForChatContainer()
  }

  const previousPathname = await storage.getPreviousPathname()
  if (previousPathname !== location.pathname) {
    await storage.setPreviousPathname(location.pathname)
    await storage.setSpokenCount(0)
  }

  observeComments(chatContainer, async (payload) => {
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

    await speak(message)

    chatCount++
  })
}
