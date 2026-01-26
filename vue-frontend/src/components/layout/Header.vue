<script setup>
import { ref } from "vue";
import { nextTick } from "vue";
import SearchInput from "@/components/common/SearchInput.vue";

const emit = defineEmits(["search"]);
const keyword = ref("");

const handleSearch = () => {
    emit("search", keyword.value);
    keyword.value = "";
    scrollToSection("Movie");
};

const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 40;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
        top,
        behavior: "smooth",
    });
};
</script>
<template>
    <div class="header">
        <div class="text-wrapper">
            <div class="main-text">
                <div class="search">
                    <SearchInput v-model="keyword" placeholder="俳優名・映画タイトルで検索" @search="handleSearch" />
                </div>
                <h1>Actors and Movies,<br>
                    Search What You Love, <br>
                    All in One Place
                </h1>
            </div>
            <div class="sub-aria">
                <div class="sub-image">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                    <img src="/images/movie1.jpg" alt="">
                    <img src="/images/movie2.jpg" alt="">
                    <img src="/images/movie3.jpg" alt="">
                    <img src="/images/movie4.jpg" alt="">
                    <img src="/images/movie5.jpg" alt="">
                    <img src="/images/movie6.jpg" alt="">
                    <img src="/images/movie7.jpg" alt="">
                    <img src="/images/movie8.jpg" alt="">
                    <img src="/images/movie9.jpg" alt="">
                </div>
                <div class="sub-text">
                    <h4>あなたの<span>出会いはここから</span></h4>
                    <p>俳優や映画の情報を簡単に検索でき、気になる作品やお気に入りの俳優をすぐに見つけられます。<br>最新の映画情報やキャストの詳細もチェック可能で、新しい作品との出会いを逃さず楽しむことができます。
                    </p>
                </div>
            </div>
        </div>
        <svg class="curve" viewBox="0 0 1440 150" preserveAspectRatio="none">
            <path d="M0,150 C480,-50 960,-50 1440,150 L1440,150 L0,150 Z" fill="white" />
        </svg>
    </div>
</template>

<style scoped>
.header {
    position: relative;
    height: 700px;
    background-color: black;
    color: white;
    overflow: visible;
}

.text-wrapper {
    z-index: 1;
    width: 100%;
}

.curve {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 100;
}

.main-text {
    height: 350px;
}


.search {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    text-align: right;
}

.search-form {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 900px;
    padding: 6px 12px;
    gap: 8px;
    width: 360px;
}

.search-icon {
    font-size: 15px;
    color: #666;
}

.search-form input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 14px;
}

.search-form button {
    border: none;
    background: black;
    color: white;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 14px;
    cursor: pointer;
}

.search-form button:hover {
    background: #333;
}


.main-text h1 {
    position: absolute;
    top: 200px;
    left: 50px;
    color: white;
    font-size: 40px;
    text-align: left;
    z-index: 1;
}

.sub-aria {
    position: relative;
    height: 350px;
    width: 100%;
    background-color: rgb(43, 43, 43);
    overflow: hidden;
}

.sub-image {
    display: grid;
    grid-template-columns: repeat(20, 100px);
    gap: 8px;
    padding: 8px;
}

.sub-image img {
    height: 120px;
    width: 100px;
    object-fit: cover;
    opacity: 0.2;
}

.sub-text {
    position: absolute;
    top: 50px;
    right: 50px;
    color: white;
    font-size: 24px;
    width: 300px;
    z-index: 1;
}

.sub-text h4 {
    margin-bottom: 10px;
}

.sub-text h4 span {
    background-color: white;
    color: black;
    margin: 2px;
    padding: 0 2px;
}

.sub-text p {
    font-size: 16px;
}

.content {
    background-color: white;
    min-height: 100vh;
    padding: 2rem;
}

@media (max-width: 550px) {
    .main-text h1 {
        position: absolute;
        top: 100px;
        left: 30px;
        color: white;
        font-size: 35px;
        text-align: left;
        z-index: 1;
    }

    .curve {
        height: 30px;
    }

    .search-form {
        width: 300px;
    }

    .search {
        position: absolute;
        top: 10px;
        right: 20px;
        z-index: 10;
        text-align: right;
    }
}
</style>
