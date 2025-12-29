<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const movies = ref([]);
const actors = ref([]);
const popupMovie = ref(null);
const popupActor = ref(null); 
// 初期ロード
onMounted(async () => {
  try {
    const resMovies = await axios.get("http://localhost:3000/api/movie");
    movies.value = resMovies.data;

    const resActors = await axios.get("http://localhost:3000/api/actor");
    actors.value = resActors.data;
  } catch (err) {
    console.error(err);
  }
});

// 映画ポップアップを開く
const openPopup = (movie_no) => {
    popupMovie.value = null; 
      popupActor.value = null; 
  const movie = movies.value.find(m => m.movie_no === movie_no);
  if (!movie) return;

  // actors配列から出演俳優を取得
  movie.actorDetails = movie.actors
    ? movie.actors.map(aNo => actors.value.find(a => a.actor_no === aNo)).filter(Boolean)
    : [];

  popupMovie.value = movie;
};
const openActor = (actor_no) => {
  popupMovie.value = null; // 映画ポップアップを閉じる

  const actor = actors.value.find(a => a.actor_no === actor_no);
  if (!actor) return;
  // console.log(actor);
  // actor.movieDetailsを作る（出演映画情報）
  console.log(actor.movieDetails);
  console.log(actor.movies);
  actor.movieDetails = actor.movies
    ? actor.movies.map(mNo => movies.value.find(m => m.movie_no === mNo)).filter(Boolean)
    : [];

  popupActor.value = actor;
  console.log(popupActor.value);
};
// 閉じる
const closePopup = () => {
  popupMovie.value = null;
    popupActor.value = null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${String(d.getMonth()+1).padStart(2,"0")}月${String(d.getDate()).padStart(2,"0")}日`;
};
</script>

<template>
  <div class="container">
    <h1>映画一覧</h1>

    <ul class="movie-list">
      <li v-for="m in movies" :key="m.movie_no" class="movie-item">
        <div class="movie-row">
          <span class="movie-title">{{ m.title }}</span>
          <button class="detail-btn" @click="openPopup(m.movie_no)">
            詳細を見る
          </button>
        </div>
      </li>
    </ul>

    <!-- 映画ポップアップ -->
    <div v-if="popupMovie" class="popup">
      <div class="popup-content">
        <h3>{{ popupMovie.title }}</h3>

        <p>カテゴリー: {{ popupMovie.category }}</p>
        <p>公開日: {{ formatDate(popupMovie.relese_date) }}</p>
        <p>年齢制限: {{ popupMovie.age_limit }}</p>

        <p>ジャンル:
          <span v-for="g in popupMovie.genres" :key="g">{{ g }}</span>
        </p>

        <h4>出演俳優</h4>
        <ul>
          <li v-for="actor in popupMovie.actorDetails" :key="actor.actor_no">
            <button @click="openActor(actor.actor_no)">{{ actor.name }}</button>
          </li>
        </ul>

        <button @click="closePopup" class="detail-btn" style="width: 100%; margin-top: 10px;">
          閉じる
        </button>
      </div>
    </div>

        <!-- 俳優ポップアップ -->
    <div v-if="popupActor" class="popup">
      <div class="popup-content">
        <h3>{{ popupActor.name }}</h3>
        <p>性別: {{ popupActor.gender }}</p>
        <p>生年月日: {{ formatDate(popupActor.date_of_birth) }}</p>
        <p>国籍: {{ popupActor.nationality }}</p>
        <p>受賞歴:
          <span v-for="(award, idx) in popupActor.awards.length ? popupActor.awards : ['なし']" :key="idx">
            {{ award }}
          </span>
        </p>

        <h4>出演映画</h4>
        <ul>
          <li v-for="movie in popupActor.movieDetails" :key="movie.movie_no">
            <button @click="openPopup(movie.movie_no)">{{ movie.title }}</button>
          </li>
        </ul>

        <button class="detail-btn" @click="closePopup" style="width: 100%; margin-top: 10px;">閉じる</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ⭐ ポップアップ */
span {
  display:block;
}
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 300px;
}

.movie-list {
  list-style: none;
  padding: 0;
}

.movie-item {
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 14px 16px;
  background: #fff;
}

.movie-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.movie-title {
  font-size: 18px;
}

.detail-btn {
  padding: 8px 14px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.detail-btn:hover {
  opacity: 0.9;
}

.popup-content ul{
  margin:0;
  padding:0;
}
.popup-content ul li{
  list-style-type:none;
  display:inline-block;
  margin-right:6px;
  margin-bottom:4px;
  background:#eee;
  padding:2px 6px;
  border-radius:4px;
}
.popup-content ul li button{
  border: none;
  cursor: pointer;
}
</style>
