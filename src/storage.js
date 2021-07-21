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

export async function getSpokenCount() {
  const spokenCount = await getStorageValue('spokenCount', '0')
  return parseInt(spokenCount, 10)
}

export function setSpokenCount(spokenCount) {
  return setStorageValue('spokenCount', spokenCount.toString())
}

export function getPreviousPathname() {
  return getStorageValue('previousPathname', '')
}

export function setPreviousPathname(previousPathname) {
  return setStorageValue('previousPathname', previousPathname)
}

export async function getMuted() {
  const mute = await getStorageValue('mute', 'off')
  return mute === 'on'
}

export function setMuted(isMuted) {
  return setStorageValue('mute', isMuted ? 'on' : 'off')
}

export async function getVolume() {
  const volume = await getStorageValue('volume', '1.0')
  return parseFloat(volume)
}

export function setVolume(volume) {
  return setStorageValue('volume', volume.toString())
}

export async function getPitch() {
  const pitch = await getStorageValue('pitch', '1.0')
  return parseFloat(pitch)
}

export function setPitch(pitch) {
  return setStorageValue('pitch', pitch.toString())
}

export async function getRate() {
  const rate = await getStorageValue('rate', '1.0')
  return parseFloat(rate)
}

export function setRate(rate) {
  return setStorageValue('rate', rate.toString())
}
