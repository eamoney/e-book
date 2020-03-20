import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

export function home () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function shelf () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

export function download (book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  const url = `${process.env.VUE_APP_EPUB_URL}/${book.categoryText}/${book.fileName}.epub`
  return axios.create({
    method: 'get',
    // 下载的电子书 是一个blob对象 这个需要定义
    responseType: 'blob',
    timeout: 180 * 1000,
    // 定义进度相关事件 
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(url).then(res => {
    const blob = new Blob([res.data])
    setLocalForage(book.fileName, blob, () => {
      if (onSuccess) onSuccess(book)
    }, err => {
      if (onError) onError(err)
    })
  }).catch(err => {
    if (onError) onError(err)
  })
}
