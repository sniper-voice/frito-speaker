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
  const items = await getStorageValues()
  if (items.mute === 'on') {
    return
  }

  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = 'ja-JP'
  utterance.volume = parseFloat(items.volume)
  utterance.pitch = parseFloat(items.pitch)
  utterance.rate = parseFloat(items.rate)
  speechSynthesis.speak(utterance)
}

function getStorageValues() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve(items)
    })
  })
}

async function main() {
  let chatContainer = document.querySelector('.chatContainer__statusOpen__chat')

  if (!chatContainer) {
    chatContainer = await waitForChatContainer()
  }

  observeComments(chatContainer, async (type, name, comment) => {
    speak(comment)
  })
}
