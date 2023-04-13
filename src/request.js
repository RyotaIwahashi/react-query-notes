import axios from 'axios'

const baseUrl = '/api/notes'

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
