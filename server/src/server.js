const express = require('express');
// expressを使えるようにする宣言
const cors = require('cors');
// 他のページでもデータの受け渡しができるようにする宣言
const bodyParser = require('body-parser');
// JSONデータを読み取れるようにする宣言

const app = express();
//このページの本体みたいな
app.use(cors());
//このページでデータの受け渡しができるよ
app.use(bodyParser.json());
//このページでJSONデータが読み取れるようになるよ

let todos = [];
//保存用、送る用の配列
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(todos);
  next(); // 次の処理に進む
});


// let id = 0;
// let idCounter = 0;
app.post('/todos', (req, res) => {
  // todosのデータをこのページで受け取るよ。

  // reqの意味
  // req.body → POSTで送られたデータ（JSON）
  // req.params → URLの /todos/123 みたいな部分
  // req.query → /todos?search=... の部分
  // req.method → POST, GET などの種類
  // req.url → リクエストされたURL

  // resの意味
  // res.json({ message: "成功しました" });
  // res.send("OK");

  const { task } = req.body;

  // 楽なほうを使いましょう
  // const task = req.body.task;
  // const done = req.body.done;
  // const user = req.body.user;

  // const { task, done, user } = req.body;


  // const newTodo =   task ;
  todos.push(task);
  // todosの配列にnewTodoの内容を入れるよ
  res.json(task);
  // resを使ってJSONでnewTodoを返す
  // 今保存された内容
});

app.get('/todos', (req, res) => {
  res.json(todos);
  // console.log(todos)
  // resを使ってJSONでtodosを返す
  // 今までに保存された内容
});

// app.delete('/todos/:id', (req, res) => {
//   const id = Number(req.params.id); // URL の :id を取得
//   // 配列から指定ID以外のものを残す
//   const beforeLength = todos.length;
//   todos = todos.filter(todo => todo.id !== id);

//   if (todos.length < beforeLength) {
//     // 削除できた場合
//     res.json({ message: `Todo ${id} を削除しました` });
//   } else {
//     // 指定IDが存在しなかった場合
//     res.status(404).json({ error: `Todo ${id} が見つかりません` });
//   }
// });

// サーバー起動
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
