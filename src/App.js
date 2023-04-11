// このアプリケーションでnotes backendでデータを作成する際には、
// js-application 側のフロントエンドを一回起動して、ログイン処理して
// localStorage にユーザ情報や token を保持しておく必要がある。
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'

import { getNotes } from './request'

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

  // クエリは、一意のキーに結び付けられたデータの非同期ソースに対する宣言的な依存関係。
  // サーバーからデータをフェッチするために、任意の Promise ベースのメソッド でクエリを使用できる。
  // 指定した一意のキーは、アプリケーション全体でクエリを再取得、キャッシュ、および共有するために内部的に使用される。
  // 返されるクエリ結果には、テンプレート化やその他のデータの使用に必要なクエリに関するすべての情報が含まれている。
  // https://tanstack.com/query/latest/docs/react/guides/queries
  const result = useQuery('notes', getNotes)

  // クエリのstatusが変更されたら再レンダリングしてくれるっぽい。
  // つまり、useState や store を使って再レンダリングするようにしなくても、
  // サーバー上のデータは完全に React Query ライブラリの管理下に置いて、画面の状態を操作することができる。
  if( result.isLoading ) {
    return <div>loading data...</div>
  }

  const notes = result.data

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
