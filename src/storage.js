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

export function getSpokenCount() {
  return parseInt(getStorageValue('spokenCount', '0'), 10)
}

export function setSpokenCount(spokenCount) {
  return setStorageValue('spokenCount', spokenCount.toString())
}

export function setPreviousPathname(previousPathname) {
  return setStorageValue('previousPathname', previousPathname)
}

export function getMuted() {
  return getStorageValue('mute', 'off').then((mute) => mute === 'on')
}

export function setMuted(isMuted) {
  return setStorageValue('mute', isMuted ? 'on' : 'off')
}

export function getVolume() {
  return parseFloat(getStorageValue('volume', '1.0'))
}

export function setVolume(volume) {
  return setStorageValue('volume', volume.toString())
}

export function getPitch() {
  return parseFloat(getStorageValue('pitch', '1.0'))
}

export function setPitch(pitch) {
  return setStorageValue('pitch', pitch.toString())
}

export function getRate() {
  return parseFloat(getStorageValue('rate', '1.0'))
}

export function setRate(rate) {
  return setStorageValue('rate', rate.toString())
}
