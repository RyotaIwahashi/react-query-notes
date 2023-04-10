// このアプリケーションでnotes backendからデータを取得するには、
// js-application 側のフロントエンドを一回起動して、ログイン処理して
// localStorage に ユーザ情報や token を保持しておく必要がある。
import axios from 'axios'

const baseUrl = '/api/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
getAll() // これでbackendにリクエストは飛んでることを確認できた。

const App = () => {
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
