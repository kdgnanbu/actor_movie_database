<script setup>
import { ref } from "vue";
import SearchInput from "@/components/common/SearchInput.vue";

const emit = defineEmits(["search"]);

const keyword = ref("");
const selectedGender = ref(null);
const selectedAge = ref(null);

const searchActor = () => {
    emit("search", {
        keyword: keyword.value,
        gender: selectedGender.value,
        ageRange: selectedAge.value,
    });
};
</script>

<template>
    <div class="search-center">
        <SearchInput v-model="keyword" placeholder="俳優名で検索" @search="searchActor" />
    </div>

    <div class="filter-area">
        <div class="filter-group">
            <span class="label">性別</span>
            <button class="filter-btn" :class="{ active: selectedGender === 1 }"
                @click="selectedGender = selectedGender === 1 ? null : 1">
                男性
            </button>
            <button class="filter-btn" :class="{ active: selectedGender === 2 }"
                @click="selectedGender = selectedGender === 2 ? null : 2">
                女性
            </button>
            <button class="filter-btn" :class="{ active: selectedGender === 3 }"
                @click="selectedGender = selectedGender === 3 ? null : 3">
                その他
            </button>
        </div>

        <div class="filter-group">
            <span class="label">年代</span>
            <button v-for="age in ['10s', '20s', '30s', '40s', '50s', '60s']" :key="age" class="filter-btn"
                :class="{ active: selectedAge === age }" @click="selectedAge = selectedAge === age ? null : age">
                {{ age === '60s' ? '60代〜' : age.replace('s', '代') }}
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
