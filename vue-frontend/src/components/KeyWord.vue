<script setup>
import { ref } from "vue";
import axios from 'axios';
import Result from "./Result.vue";

const keyword = ref("");
const genres = ref([]);
const categories = ref([]);

const results = ref([]);
let searchResult = ref([]);
const resultKey = ref(0);

const selectedGenres = ref([]);
const selectedCategories = ref([]);

const showResult = ref(false);
const isEmpty = ref(false);

const keySearch = async () => {
  if (
    keyword.value.trim() === "" &&
    selectedGenres.value.length === 0 &&
    selectedCategories.value.length === 0
  ) {
    isEmpty.value = true;
    showResult.value = true;
    resultKey.value++;
    return;
  }
  isEmpty.value = false;
  try {
    // 🔥 ① まず POST を完了させる（ここが重要）
    await axios.post("http://localhost:3000/api/search", {
      keyword: keyword.value,
      genres: selectedGenres.value,
      categories: selectedCategories.value
    });

    // 🔥 ② POST 完了後に Result.vue を更新
    showResult.value = true;
    resultKey.value++;

    // 🔥 ③ 入力をクリア
    keyword.value = "";

  } catch (err) {
    console.error("検索通信エラー:", err);
  }
};



const fetchTodos = async () => {
    const res = await axios.get('http://localhost:3000/api/search');
    console.log(res);
    console.log(res.data)
};

const toggleGenre = (g) => {
    if (selectedGenres.value.includes(g)) {
        selectedGenres.value = selectedGenres.value.filter(item => item !== g);
    } else {
        selectedGenres.value.push(g);
    }
};
const toggleCategory = (c) => {
    if (selectedCategories.value.includes(c)) {
        selectedCategories.value = selectedCategories.value.filter(item => item !== c);
    } else {
        selectedCategories.value.push(c);
    }
};

const fetchCategories = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/movie/categories');
        categories.value = res.data;
    } catch (err) {
        console.error("カテゴリー取得エラー:", err);
    }
};
const fetchGenre = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/movie/genre');
        genres.value = res.data;
    } catch (err) {
        console.error("ジャンル取得エラー:", err);
    }
};
import { onMounted } from 'vue';
onMounted(() => {
    fetchCategories();
    fetchGenre();
});

</script>

<template>
    <div class="search-container">
        <h1 class="title">キーワード検索</h1>
        <div class="search-box">
            <input v-model="keyword" class="search-input" placeholder="キーワードを検索" />
            <button class="search-btn" @click="keySearch()">検索</button>
        </div>

        <div class="filter-buttons">
            <div class="filter-group">
                <span>ジャンル</span><br />
                <button v-for="g in genres" :key="g" class="filter-btn"
                    :class="{ active: selectedGenres.includes(g.id) }" @click="toggleGenre(g.id)">
                    {{ g.name }}
                </button>
            </div>

            <div class="filter-group">
                <span>カテゴリー</span><br />
                <button v-for="c in categories" :key="c.id" class="filter-btn"
                    :class="{ active: selectedCategories.includes(c.id) }" @click="toggleCategory(c.id)">
                    {{ c.name }}
                </button>
            </div>
            <Result v-if="showResult" :reload="resultKey" :is-empty="isEmpty" />
        </div>

    </div>
</template>
<style >
/* 全体コンテナ */
.search-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 24px;
    background: #fff;
    border-radius: 16px;
    font-family: "Segoe UI", sans-serif;
}

/* タイトル */
.title {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

/* 検索ボックス */
.search-box {
    display: flex;
    gap: 12px;
}

.search-input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #ccc;
    font-size: 16px;
    transition: 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
}

.search-btn {
    padding: 12px 20px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.search-btn:hover {
    background: #45a049;
}

/* フィルター・ボタンエリア */
.filter-buttons {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.filter-group {
    gap: 10px;
}

.filter-group button {
    margin: 5px;
}

.filter-group span {
    font-weight: 600;
    margin-right: 8px;
    min-width: 70px;
}

/* ジャンル・カテゴリーのボタン */
.filter-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background: #f7f7f7;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.filter-btn:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
}

.filter-btn.active {
    background: #4caf50;
    color: white;
    border-color: #4caf50;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(76, 175, 80, 0.4);
}
</style>
