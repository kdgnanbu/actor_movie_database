<script setup>
import { ref } from "vue";
import Actor from "./components/Actor.vue";
import Movie from "./components/Movie.vue";
import KeyWord from "./components/KeyWord.vue";
import Result from "./components/Result.vue";
const view = ref("actor");

</script>

<template>
    <Sample />
  <div class="menu">
    <button :class="{ active: view === 'actor' }" @click="view = 'actor'">
      俳優一覧
    </button>
    <button :class="{ active: view === 'movie' }" @click="view = 'movie'">
      映画一覧
    </button>
        <button :class="{ active: view === 'keyword' }" @click="view = 'keyword'">
      キーワード検索
    </button>
  </div>

  <div class="main">
    <Actor v-if="view === 'actor'" />
    <Movie v-if="view === 'movie'" />
    <KeyWord v-if="view === 'keyword'" />
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

.menu button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  cursor: pointer;
  transition: 0.2s;
}

.menu button.active {
  background: #4caf50;
  color: white;
  border-color: white;
  transform: translateY(-2px);
}

.menu button:hover {
  background: #eaeaea;
}

.menu button:focus {
  outline: none;
}

.main {
  margin-top: 20px;
}

.input-area {
  width: 400px;
  text-align: center;
  margin: auto;
  /* display: flex; */
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
</style>
