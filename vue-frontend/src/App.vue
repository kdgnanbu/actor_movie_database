<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
import Movie from "./components/movie/Movie.vue";
import Actor from "./components/actor/Actor.vue";

/* --------------------
 * state
 * -------------------- */
const allActors = ref([]);
const allMovies = ref([]);
const movies = ref([]);
const actors = ref([]);

/* --------------------
 * 初期データ取得
 * -------------------- */
onMounted(async () => {
  try {
    const [movieRes, actorRes] = await Promise.all([
      axios.get("https://sample-api-8mg5.onrender.com/api/movie"),
      axios.get("https://sample-api-8mg5.onrender.com/api/actor"),
    ]);

    allMovies.value = movieRes.data;
    allActors.value = actorRes.data;

    if (movieRes?.data) movies.value = movieRes.data;
    if (actorRes?.data) actors.value = actorRes.data;
  } catch (err) {
    console.error("初期データ取得エラー:", err);
  }
});
console.log(actors.image_path);
console.log(movies.image_path);

/* --------------------
 * 検索処理
 * -------------------- */
const handleSearch = async (payload) => {
  try {
    // Header からは string
    // Popup からは { type, conditions }
    let type;
    let conditions;

    if (typeof payload === "string") {
      type = "both"; // 映画・俳優 両方検索
      conditions = { keyword: payload };
    } else {
      type = payload.type;
      conditions = payload.conditions;
    }

    const requests = [];

    // movie
    if (type === "movie" || type === "both") {
      requests.push(
        axios.post(
          "https://sample-api-8mg5.onrender.com/api/movie/search",
          conditions
        )
      );
    } else {
      requests.push(Promise.resolve({ data: movies.value }));
    }

    // actor
    if (type === "actor" || type === "both") {
      requests.push(
        axios.post(
          "https://sample-api-8mg5.onrender.com/api/actor/search",
          conditions
        )
      );
    } else {
      requests.push(Promise.resolve({ data: actors.value }));
    }

    const [movieRes, actorRes] = await Promise.all(requests);

    if (movieRes?.data) movies.value = movieRes.data;
    if (actorRes?.data) actors.value = actorRes.data;
  } catch (err) {
    console.error("検索エラー:", err);
  }
};
</script>

<template>
  
  <Header @search="handleSearch" />

  <section id="Movie">
    <Movie
      :movies="movies"
      :actors="actors"
      :allActors="allActors"
      :allMovies="allMovies"
      @search="handleSearch"
    />
  </section>

  <Actor
    :movies="movies"
    :actors="actors"
    :allActors="allActors"
    :allMovies="allMovies"
    @search="handleSearch"
  />

  <Footer />
</template>

<style scoped>
.search-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  font-family: "Segoe UI", sans-serif;
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
  border-color: #4c63af;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
}

.search-btn {
  padding: 12px 20px;
  background: #4c51af;
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
</style>
