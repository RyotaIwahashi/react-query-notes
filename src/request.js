import axios from 'axios'

const baseUrl = '/api/notes'
// const baseUrl = 'https://247c-203-179-202-122.ngrok-free.app/api/notes'
// バックエンド側はcors設定してるし、ngrok 側の問題かも。てか cors なくてもlocalhost:3000 -> localhost:8080 にアクセスできたんやけどどういうこと？？
// https://www.web-dev-qa-db-ja.com/ja/ngrok/ngrok%E3%81%AEcors%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E3%82%92%E6%A7%8B%E6%88%90%E3%81%99%E3%82%8B/827590900/

let token

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getNotes = () => {
  return axios.get(baseUrl).then(res => res.data)
}

export const createNote = newNote => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  
  return axios.post(baseUrl, newNote, config).then(res => res.data) // res.data は onSuccessなどで取得できるパラメータ
}

export const updateNote = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)
