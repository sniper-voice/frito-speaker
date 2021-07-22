import * as storage from './storage.js'
import { filterPronounceable } from './filterPronounceable.js'

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
          const name = node.querySelector('.chat__contents__name').innerText
          const comment = node.querySelector(
            '.chat__contents__comment'
          ).innerText
          callback('comment', name, comment)
        } else if (node.classList.contains('joinRoomChat')) {
          callback('join', null, node.innerText)
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
    const utterance = new SpeechSynthesisUtterance(pronounceableMessage)
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

  observeComments(chatContainer, async (type, name, comment) => {
    await speak(comment)
    chatCount++
  })
}
