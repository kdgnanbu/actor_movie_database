<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const keyword = ref("");
const results = ref([]);         // 検索結果
const actors = ref([]);          // 抽出された俳優
const movies = ref([]);          // 抽出された映画

// ポップアップ
const popupActor = ref(null);
const popupMovie = ref(null);

const props = defineProps({
  reload: Number,
  isEmpty: Boolean
});

// 全データ
const moviesAll = ref([]);
const actorsAll = ref([]);

// 初期ロード（映画・俳優一覧）
onMounted(async () => {
  fetchResults();
  try {
    const resMovies = await axios.get("http://localhost:3000/api/movie");
    moviesAll.value = resMovies.data;
    const resActors = await axios.get("http://localhost:3000/api/actor");
    actorsAll.value = resActors.data;
  } catch (err) {
    console.error(err);
  }
});

/* -------------------------
   検索結果の適用ロジック
-------------------------- */
const fetchResults = async () => {
  if (props.isEmpty) {
    results.value = [];
    actors.value = [];
    movies.value = [];
    return;
  }

  try {
    const res = await axios.get("http://localhost:3000/api/search/result");
    results.value = res.data;

    // 映画ID と 俳優ID を抽出
    const movieIds = results.value
      .filter(r => r.type === "movie")
      .map(r => r.movie_no);

    const actorIds = results.value
      .filter(r => r.type === "actor")
      .map(r => r.id);

    // 該当映画
    movies.value = moviesAll.value.filter(m =>
      movieIds.includes(m.movie_no)
    );

    // 該当俳優
    actors.value = actorsAll.value.filter(a =>
      actorIds.includes(a.actor_no)
    );

  } catch (err) {
    console.error(err);
  }
  console.log("search result actors:", results.value.filter(r => r.type === "actor"));

};

watch(() => props.reload, fetchResults);
fetchResults();

/* -------------------------
   共通フォーマット
-------------------------- */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, "0")}月${String(d.getDate()).padStart(2, "0")}日`;
};

/* -------------------------
   ポップアップ開閉処理
-------------------------- */

const openActorPopup = (actor_name) => {
  popupMovie.value = null;
  const actor = actorsAll.value.find(a => a.name === actor_name);
  if (!actor) return;

  actor.movieDetails = actor.movies.map(mNo =>
    moviesAll.value.find(m => m.movie_no === mNo)
  ).filter(Boolean);
  popupActor.value = actor;
};

const closeActorPopup = () => {
  popupActor.value = null;
};

// 俳優ポップアップ → 映画ポップアップへ切り替え
const openMoviePopup = (movie_no) => {
    popupActor.value = null;
const movie = moviesAll.value.find(m => m.movie_no === movie_no);

  movie.actorDetails = movie.actors.map(aNo =>
  actorsAll.value.find(a => a.actor_no === aNo)
).filter(Boolean);
  popupMovie.value = movie;
};

const closeMoviePopup = () => {
  popupMovie.value = null;
};
</script>


<template>
  <h2>検索結果</h2>

  <div v-if="isEmpty">
    <p>※検索条件が入力されていません</p>
  </div>

  <div v-else>

    <!-- 俳優情報 -->
    <h3>俳優情報</h3>
    <div v-if="actors.length" class="results">
      <ul class="actor-list">
        <li
          v-for="actor in actors"
          :key="actor.name"
          class="actor-item"
        >
          <span>{{ actor.name }}</span>
          <button class="detail-btn" @click="openActorPopup(actor.name)">
            詳細を見る
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>※該当する情報はありません</p>
    </div>

    <!-- 映画情報 -->
    <h3>映画情報</h3>
    <div v-if="movies.length" class="results">
      <ul class="actor-list">
        <li
          v-for="movie in movies"
          :key="movie.movie_no"
          class="actor-item"
        >
          <span>{{ movie.title }}</span>
          <button class="detail-btn" @click="openMoviePopup(movie.movie_no)">
            詳細を見る
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>※該当する情報はありません</p>
    </div>
  </div>

  <!-- 俳優ポップアップ -->
  <div v-if="popupActor" class="popup">
    <div class="popup-content">
      <h3>{{ popupActor.name }}</h3>

      <p>性別: {{ popupActor.gender }}</p>
      <p>生年月日: {{ formatDate(popupActor.date_of_birth) }}</p>
      <p>国籍: {{ popupActor.nationality }}</p>

      <p>受賞歴:<br>
        <span
          v-for="(award, key) in popupActor.awards.length ? popupActor.awards : ['なし']"
          :key="key"
        >
          {{ award }}
        </span>
      </p>

      <h4>出演映画</h4>
      <ul>
        <li
          v-for="movie in popupActor.movieDetails"
          :key="movie.movie_no"
        >
          <button @click="openMoviePopup(movie.movie_no)">
            {{ movie.title }}
          </button>
        </li>
      </ul>

      <button
        class="detail-btn"
        @click="closeActorPopup"
        style="width: 100%; margin-top: 10px;"
      >
        閉じる
      </button>
    </div>
  </div>


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
        <li
          v-for="actor in popupMovie.actorDetails"
          :key="actor.actor_no"
        >
          <button @click="openActorPopup(actor.name)">
            {{ actor.name }}
          </button>
        </li>
      </ul>

      <button
        class="detail-btn"
        @click="closeMoviePopup"
        style="width: 100%; margin-top: 10px;"
      >
        閉じる
      </button>
    </div>
  </div>
</template>


<style scoped>
.actor-list {
  list-style: none;
  padding: 0;
}

.actor-item {
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
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

/* ポップアップ共通 */
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

span {
  display: block;
}

ul {
  margin: 0;
  padding: 0;
}

ul li {
  list-style-type: none;
  display: inline-block;
  margin-right: 6px;
  margin-bottom: 4px;
  background: #eee;
  padding: 2px 6px;
  border-radius: 4px;
}

ul li button {
  border: none;
  cursor: pointer;
}

h2 {
  text-align: center;
}
</style>
