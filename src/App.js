// react query は、クライアント-サーバ間の非同期操作の管理を担当し、アプリケーションを簡素化させることができる。
// フロントエンドでサーバーの状態を維持するライブラリであり、サーバーに保存されているもののキャッシュとして機能する。
// 一方、react query を使用する場合、Redux は、サーバと同期しないデータの保存に使用できる。
// ほとんどのアプリケーションは、サーバから提供されたデータを一時的に保存する方法だけでなく、
// フロントエンドの残りの状態 (フォームや通知の状態など) を処理するための何らかのソリューションも必要とする。

// このアプリケーションでnotes backendでデータを作成する際には、
// js-application 側のフロントエンドを一回起動して、ログイン処理して
// localStorage にユーザ情報や token を保持しておく必要がある。
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { getNotes, createNote, setToken, updateNote } from './request'

const App = () => {

  // useQueryClient を useState の後に定義すると warning が出る
  // https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks
  const queryClient = new useQueryClient()

  const [user, setUser] = useState(null)

  useEffect(() => {
    // アクセスの度にlocalStorageからログイン情報を読み込む
    // データはオリジン毎に保存される。オリジンとは、プロトコル、ドメイン、ポート番号の事。
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  // ミューテーションは通常、データの作成/更新/削除、またはサーバーの副作用の実行に使用される
  // https://tanstack.com/query/latest/docs/react/guides/mutations
  const newNoteMutation = useMutation(createNote, {
    // onSuccess: () => {
      // React Query が管理するキー notes が無効であることを通知する
      // React Query はキー notes を使用してクエリを自動的に更新して、再レンダリングする
      // queryClient.invalidateQueries('notes')
    // }
    onSuccess: (newNote) => {
      // ↑の方法だと毎回GETリクエストを送るのでサーバに負担がかかる場合がある。
      // 直接クエリ内で管理されている notes を更新しても良い。reducer の state を更新するイメージ。
      const notes = queryClient.getQueryData('notes')
      queryClient.setQueryData('notes', notes.concat(newNote))
    }
  })

  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({ ...note, important: !note.important })
  }

  // クエリは、一意のキーに結び付けられたデータの非同期ソースに対する宣言的な依存関係。
  // サーバーからデータをフェッチするために、任意の Promise ベースのメソッド でクエリを使用できる。
  // 指定した一意のキーは、アプリケーション全体でクエリを再取得、キャッシュ、および共有するために内部的に使用される。
  // 返されるクエリ結果には、テンプレート化やその他のデータの使用に必要なクエリに関するすべての情報が含まれている。
  // https://tanstack.com/query/latest/docs/react/guides/queries
  const result = useQuery('notes', getNotes, {
    refetchOnWindowFocus: false // デフォルトでは、アプリのフォーカスが変更されたときにfetchする機能があるので off にする。
  }) // reducer の notes とそれに紐づく status っていうstateがあるイメージ？

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
