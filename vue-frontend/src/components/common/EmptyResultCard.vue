<script setup>
defineProps({
    label: {
        type: String,
        default: "検索結果がありません"
    }
});
</script>

<template>
    <div class="empty-card">
        <i class="fa-regular fa-face-frown"></i>
        <p>{{ label }}</p>
        <small>条件を変えて再検索してみてください</small>
    </div>
</template>

<style scoped>
.empty-card {
    width: 70%;
    margin: 40px auto;
    padding: 32px;
    text-align: center;
    color: #666;
    border: 1px dashed #ccc;
    border-radius: 12px;
}
</style>
