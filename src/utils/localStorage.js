import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStorage (key, value) {
  return localStorage.set(key, value)
}

export function getLocalStorage (key) {
  return localStorage.get(key)
}

export function removeLocalStorage (key) {
  return localStorage.delete(key)
}

export function clearLocalStorage () {
  return localStorage.clear()
}
/** 将一本书需要用到存储器的属性 统一集成到book对象上 */
export function setBookObject (fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`)
  if (!book){
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}

export function getBookObject (fileName, key) {
  let book = getLocalStorage(`${fileName}-info`)
  if (book){
    return book[key]
  } else {
    return null
  }
}

export function getFontFamily (fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily (fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}

export function getFontSize (fileName) {
  return getBookObject(fileName, 'fontSzie')
}

export function saveFontSize (fileName, fontSize) {
  return setBookObject(fileName, 'fontSize', fontSize)
}
