<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SearchInput from "@/components/common/SearchInput.vue";

const emit = defineEmits(["search"]);

const keyword = ref("");
const selectedGenres = ref([]);
const selectedCategories = ref([]);

const genres = ref([]);
const categories = ref([]);

const searchMovie = () => {
    emit("search", {
        keyword: keyword.value,
        genres: selectedGenres.value,
        categories: selectedCategories.value,
    });
};

const toggleGenre = (id) => {
    selectedGenres.value = selectedGenres.value.includes(id)
        ? selectedGenres.value.filter(v => v !== id)
        : [...selectedGenres.value, id];
};

const toggleCategory = (id) => {
    selectedCategories.value = selectedCategories.value.includes(id)
        ? selectedCategories.value.filter(v => v !== id)
        : [...selectedCategories.value, id];
};

onMounted(async () => {
    try {
        const [genreRes, categoryRes] = await Promise.all([
            axios.get("http://localhost:3000/api/movie/genre"),
            axios.get("http://localhost:3000/api/movie/categories"),
        ]);
        genres.value = genreRes.data;
        categories.value = categoryRes.data;
    } catch (err) {
        console.error("初期データ取得エラー:", err);
    }
});
</script>

<template>
    <div class="search-center">
        <SearchInput v-model="keyword" placeholder="映画タイトルで検索" @search="searchMovie" />
    </div>

    <div class="filter-area">
        <div class="filter-group">
            <span class="label">ジャンル</span>
            <button v-for="g in genres" :key="g.id" class="filter-btn"
                :class="{ active: selectedGenres.includes(g.id) }" @click="toggleGenre(g.id)">
                {{ g.name }}
            </button>
        </div>

        <div class="filter-group">
            <span class="label">カテゴリー</span>
            <button v-for="c in categories" :key="c.id" class="filter-btn"
                :class="{ active: selectedCategories.includes(c.id) }" @click="toggleCategory(c.id)">
                {{ c.name }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.search-center {
    display: flex;
    justify-content: center;
}

.filter-area {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.label {
    width: 100%;
    font-weight: 600;
    margin-bottom: 6px;
}

.filter-btn {
    padding: 8px 14px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background: #f7f7f7;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
}

.filter-btn:hover {
    background: #e0e0e0;
}

.filter-btn.active {
    background: #333;
    color: #fff;
    border-color: #333;
}
</style>
