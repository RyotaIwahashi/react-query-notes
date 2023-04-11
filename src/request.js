import axios from 'axios'

const baseUrl = '/api/notes'

export const getNotes = () => {
  return axios.get(baseUrl).then(res => res.data)
}
