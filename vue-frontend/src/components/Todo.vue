<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// データの受け渡しをするときに便利なやつ

const newTask = ref('');
// 入力値
const todos = ref([]);
//受け取った配列を格納する

// Nodeからデータ取得
const fetchTodos = async () => {
  // 関数にasyncを与える
  // asyncとは非同期処理ができる関数を与える
  const res = await axios.get('http://localhost:3000/todos');
  //await 処理があるまで待機する　axios.getがあった場合に進む。
  //非同期処理にする理由はreturnすると持っているデータも返すため。
  //リアルタイムで更新続けるためには大事
  console.log(res);
  //nodeのtodosの配列を表示。そのままだとデータいっぱい持ってるよ
  console.log(res.data)
  //nodeのtodosの配列のテキストデータだけ表示。
  todos.value = res.data;
  //vueの配列の値にnodeのtodo配列のテキストデータを代入
  console.log(todos);
};
// 送信ボタンのクリックアクション
const addTask = async () => {
  //関数にasyncを与える
  if (!newTask.value) return;
  //もしタスクが入力されていなければ返すよ
  await axios.post('http://localhost:3000/todos', { task: newTask.value });
  //入力値をnodeのtodosに送るよ
  newTask.value = '';
  // 入力した値を空にする
  fetchTodos();
  //クリック後にnodeからデータを再表示するために必要
};

// const deleteTask = async (id) => {
//   try {
//     await axios.delete(`http://localhost:3000/todos/` + id);
//     fetchTodos(); // 削除後に一覧を更新
//   } catch (err) {
//     console.error('削除エラー', err);
//   }
// };

// onMounted(fetchTodos);
//最初の画面が表示されたときにnodeからデータを表示する
</script>
<template>
  <div class="container">
    <h1>Todoリスト</h1>
    <div class="input-area">
      <input v-model="newTask" placeholder="タスクを入力"/>
      <button @click="addTask">追加</button>
    </div>
    <ul class="todo-list">
      <!-- <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <span>{{ todo.task }}</span>
        <button @click="deleteTask(todo.id)">削除</button>
      </li> -->
    </ul>
  </div>
</template>

<style>
/* 全体 */
.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

/* タイトル */
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* 入力エリア */
.input-area {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-area input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.input-area button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.input-area button:hover {
  background-color: #45a049;
}

/* Todoリスト */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-size: 16px;
  transition: transform 0.2s, background-color 0.2s;
}

.todo-item:hover {
  transform: translateY(-2px);
  background-color: #e8f5e9;
}

.todo-item button {
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.todo-item button:hover {
  background-color: #d32f2f;
}
</style>
