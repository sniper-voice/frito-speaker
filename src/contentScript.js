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
        } else if (classes.includes('joinRoomChat')) {
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

function speak(voice, message) {
  const utterance = new SpeechSynthesisUtterance(message)
  utterance.voice = voice
  speechSynthesis.speak(utterance)
}

function waintForJapaneseVoice() {
  return new Promise((resolve) => {
    const voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === 'ja-JP')
    if (voice) {
      resolve(voice)
    }

    speechSynthesis.addEventListener('voiceschanged', () => {
      const voice = speechSynthesis
        .getVoices()
        .find((voice) => voice.lang === 'ja-JP')
      if (voice) {
        resolve(voice)
      }
    })
  })
}

async function main() {
  const jaVoice = await waintForJapaneseVoice()

  let chatContainer = document.querySelector('.chatContainer__statusOpen__chat')

  if (!chatContainer) {
    chatContainer = await waitForChatContainer()
  }

  observeComments(chatContainer, (type, name, comment) => {
    speak(jaVoice, comment)
  })
}
