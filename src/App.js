// このアプリケーションでnotes backendでデータを作成する際には、
// js-application 側のフロントエンドを一回起動して、ログイン処理して
// localStorage に ユーザ情報や token を保持しておく必要がある。
import axios from 'axios'
import { useState, useEffect } from 'react'

const baseUrl = '/api/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log(response.data)
  return response.data
}
getAll() // これでbackendにリクエストは飛んでることを確認できた。

const App = () => {
  const [user, setUser] = useState(null)
  // const [token, setToken] = useState('')

  useEffect(() => {
    // アクセスの度にlocalStorageからログイン情報を読み込む
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // setToken(user.token)
    }
  }, [])

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return(
    <div>
      {user &&
        <div>
          <p>{user.name} logged in</p>
        </div>
      }
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App
