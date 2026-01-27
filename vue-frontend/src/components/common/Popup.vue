<script setup>
import { computed, watch } from "vue";
import MovieSearchForm from "@/components/movie/MovieSearchForm.vue";
import ActorSearchForm from "@/components/actor/ActorSearchForm.vue";

const props = defineProps({
    type: String,
    No: Number,
    movies: Array,
    actors: Array,
    allMovies: Array,
    allActors: Array
});

watch(
    () => props.type,
    (newType) => {
        document.body.style.overflow = newType ? "hidden" : "";
    },
    { immediate: true }
);

const emit = defineEmits(["close", "change", "search"]);

const handleActorSearch = (conditions) => {
    emit("search", { type: "actor", conditions });
    emit("close");
};

const handleMovieSearch = (conditions) => {
    emit("search", { type: "movie", conditions });
    emit("close");
};

// ================================
// 日本語ソート（漢字→ひらがな→カタカナ→英字）
// ================================
const customJapaneseSort = (a, b) => {
    const getPriority = (str) => {
        if (!str) return 4;
        const ch = str[0];
        if (/[一-龯]/.test(ch)) return 0;      // 漢字
        if (/[ぁ-ん]/.test(ch)) return 1;      // ひらがな
        if (/[ァ-ヴー]/.test(ch)) return 2;    // カタカナ
        if (/[A-Za-z]/.test(ch)) return 3;     // 英字
        return 4;
    };

    const pa = getPriority(a);
    const pb = getPriority(b);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, "ja");
};

// ================================
// 映画ポップアップ（出演俳優をソート）
// ================================
const popupMovie = computed(() => {
    if (props.type !== "movie") return null;

    const movie = props.allMovies.find(m => m.movie_no === props.No);
    if (!movie) return null;

    const actorDetails = movie.actors
        .map(aNo => props.allActors.find(a => a.actor_no === aNo))
        .filter(Boolean)
        .sort((a, b) => customJapaneseSort(a.name, b.name));

    return {
        ...movie,
        actorDetails
    };
});

// ================================
// 俳優ポップアップ（出演映画をソート）
// ================================
const popupActor = computed(() => {
    if (props.type !== "actor") return null;

    const actor = props.allActors.find(a => a.actor_no === props.No);
    if (!actor) return null;

    const movieDetails = actor.movies
        .map(mNo => props.allMovies.find(m => m.movie_no === mNo))
        .filter(Boolean)
        .sort((a, b) => customJapaneseSort(a.title, b.title));

    return {
        ...actor,
        movieDetails
    };
});

const popupSearchMovie = computed(() => props.type === "search-movie");
const popupSearchActor = computed(() => props.type === "search-actor");

const openActor = (actorNo) => emit("change", { type: "actor", No: actorNo });
const openMovie = (movieNo) => emit("change", { type: "movie", No: movieNo });
const closePopup = () => emit("close");

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, "0")}月${String(d.getDate()).padStart(2, "0")}日`;
};
</script>

<template>
    <!-- 映画詳細 -->
    <div v-if="popupMovie" class="popup">
        <div class="popup-content">
            <div class="popup-body">
                <div class="left-content">
                    <img :src="popupMovie.image_path" />
                </div>
                <div class="right-content">
                    <h3>{{ popupMovie.title }}</h3>
                    <p>カテゴリー: {{ popupMovie.category }}</p>
                    <p>公開日: {{ formatDate(popupMovie.relese_date) }}</p>
                    <p>年齢制限: {{ popupMovie.age_limit }}</p>
                    <p>
                        ジャンル:
                        <span v-for="g in popupMovie.genres" :key="g">{{ g }}</span>
                    </p>

                    <h4>出演俳優</h4>
                    <ul>
                        <li v-for="actor in popupMovie.actorDetails" :key="actor.actor_no">
                            <button @click="openActor(actor.actor_no)">
                                {{ actor.name }}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <button class="detail-btn" @click="closePopup">閉じる</button>
        </div>
    </div>

    <!-- 俳優詳細 -->
    <div v-if="popupActor" class="popup">
        <div class="popup-content">
            <div class="popup-body">
                <div class="left-content">
                    <img :src="popupActor.image_path" />
                </div>
                <div class="right-content">
                    <h3>{{ popupActor.name }}</h3>
                    <p>性別: {{ popupActor.gender }}</p>
                    <p>生年月日: {{ formatDate(popupActor.date_of_birth) }}</p>
                    <p>国籍: {{ popupActor.nationality }}</p>
                    <p>
                        受賞歴:<br>
                        <span
                            v-for="(award, idx) in popupActor.awards.length ? popupActor.awards : ['なし']"
                            :key="idx"
                        >
                            {{ award }}<br>
                        </span>
                    </p>
                    <h4>出演映画</h4>
                    <ul>
                        <li v-for="movie in popupActor.movieDetails" :key="movie.movie_no">
                            <button @click="openMovie(movie.movie_no)">
                                {{ movie.title }}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <button class="detail-btn" @click="closePopup">閉じる</button>
        </div>
    </div>

    <!-- 検索 -->
    <div v-if="popupSearchMovie" class="popup">
        <div class="popup-content">
            <MovieSearchForm @search="handleMovieSearch" />
            <button class="detail-btn" @click="closePopup">閉じる</button>
        </div>
    </div>

    <div v-if="popupSearchActor" class="popup">
        <div class="popup-content">
            <ActorSearchForm @search="handleActorSearch" />
            <button class="detail-btn" @click="closePopup">閉じる</button>
        </div>
    </div>
</template>



<style>
.popup {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    overflow-y: auto;
}

.popup-content {
    background: #fff;
    padding: 24px;
    border-radius: 14px;
    width: 620px;
    margin: 0 30px;
    overflow-y: auto;
}

.popup-body {
    display: flex;
    gap: 24px;
    align-items: center;
}

.left-content {
    flex: 0 0 220px;
}

.left-content img {
    width: 100%;
    height: auto;
    border-radius: 8px;
}

.right-content {
    flex: 1;
    width: 80%;
    margin: auto;
}

.right-content h3 {
    margin: 0 0 12px;
    font-size: 22px;
    text-align: center;
    margin-bottom: 20px;
}

.right-content p {
    margin: 4px 0;
    font-size: 14px;
    color: #444;
}

.popup-content ul {
    padding: 0;
    margin: 8px 0;
}

.popup-content ul li {
    list-style: none;
    display: inline-block;
    margin-right: 6px;
    margin-bottom: 6px;
    background: #eee;
    padding: 4px 8px;
    border-radius: 4px;
}

.popup-content ul li button {
    border: none;
    background: none;
    cursor: pointer;
}

.detail-btn {
    width: 50%;
    margin-top: 10px;
    padding: 8px 14px;
    background: #333;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    margin: 20px auto 0;
    display: block;
}

@media (max-width: 550px) {
    .popup-body {
        display: block;
        gap: 24px;
        align-items: flex-start;
    }

    .left-content img {
        width: 150px;
        height: 200px;
        border-radius: 8px;
        display: block;
        margin: 0 auto 20px auto;
    }
}
</style>