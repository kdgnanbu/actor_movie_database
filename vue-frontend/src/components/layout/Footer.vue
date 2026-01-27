<template>
  <footer class="footer">
    <div class="footer__container">
      &copy; {{ new Date().getFullYear() }} Myproduct. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  margin-top: 100px;
  background-color: rgb(43, 43, 43);
  color: #fff;
  padding: 16px 32px;
  font-size: 14px;
  height: 100px;
}

.footer__container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer__right a {
  color: #fff;
  margin-left: 16px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__right a:hover {
  color: #f0a500;
}

.footer__left {
  flex: 1 1 auto;
}
</style>
