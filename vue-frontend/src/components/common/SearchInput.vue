<script setup>
defineProps({
    modelValue: String,
    placeholder: String,
})
const emit = defineEmits([
    "update:modelValue",
    "search"
])
const onSubmit = () => {
    emit("search");
}
</script>

<template>
    <form class="search-form" @submit.prevent="onSubmit">
        <span class="search-icon">
            <i class="fa-solid fa-magnifying-glass"></i>
        </span>
        <input :value="modelValue" :placeholder="placeholder" @input="emit('update:modelValue', $event.target.value)" />
        <button type="submit">検索</button>
    </form>
</template>

<style scoped>
.search {
    position: relative;
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
    border: 1px solid #000000;
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

@media (max-width:550px) {
    .search-form {
        width: 300px;
    }
}
</style>
