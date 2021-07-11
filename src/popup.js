init()

async function init() {
  const isMuted = await getMuted()
  const muteButton = document.getElementById('muteButton')
  muteButton.innerText = isMuted ? 'ミュート解除' : 'ミュート'
  muteButton.addEventListener('click', async (ev) => {
    const isMuted = await getMuted()
    const newValue = !isMuted
    muteButton.innerText = newValue ? 'ミュート解除' : 'ミュート'
    chrome.action.setBadgeText({ text: newValue ? 'MUTE' : '' })
    await setMuted(newValue)
  })

  const volumeInput = document.getElementById('volumeInput')
  volumeInput.value = await getVolume()
  volumeInput.addEventListener('change', async (ev) => {
    await setVolume(ev.target.value)
  })

  const pitchInput = document.getElementById('pitchInput')
  pitchInput.value = await getPitch()
  pitchInput.addEventListener('change', async (ev) => {
    await setPitch(ev.target.value)
  })

  const rateInput = document.getElementById('rateInput')
  rateInput.value = await getRate()
  rateInput.addEventListener('change', async (ev) => {
    await setRate(ev.target.value)
  })
}

function setMuted(isMuted) {
  return setStorageValue('mute', isMuted ? 'on' : 'off')
}

function getMuted() {
  return getStorageValue('mute', 'off').then((mute) => mute === 'on')
}

function setVolume(volume) {
  return setStorageValue('volume', volume)
}

function getVolume() {
  return getStorageValue('volume', 1.0)
}

function setPitch(pitch) {
  return setStorageValue('pitch', pitch)
}

function getPitch() {
  return getStorageValue('pitch', 1.0)
}

function setRate(rate) {
  return setStorageValue('rate', rate)
}

function getRate() {
  return getStorageValue('rate', 1.0)
}

function setStorageValue(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve()
    })
  })
}

function getStorageValue(key, defaultValue) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({ [key]: defaultValue }, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve(items[key])
    })
  })
}
