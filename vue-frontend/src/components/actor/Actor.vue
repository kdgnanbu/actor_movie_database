<script setup>
import { ref, onMounted } from 'vue';
import EmblaCarousel from "embla-carousel-vue";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import axios from 'axios';
import Popup from "@/components/common/Popup.vue";
import EmptyResultCard from "@/components/common/EmptyResultCard.vue";

defineProps({
  actors: Array,
  movies: Array,
  allMovies: Array,
  allActors: Array
});

const popupType = ref(null);
const selectedNo = ref(null);

const emit = defineEmits(["search"]);

const onSearch = ({ type, conditions }) => {
  if (type !== "actor") return;
  emit("search", { type, conditions });
  closePopup();
};

const openActor = (actor_no) => {
  popupType.value = "actor";
  selectedNo.value = actor_no;
};

const openSearch = () => {
  popupType.value = "search-actor";
  selectedNo.value = null;
};

const closePopup = () => {
  popupType.value = null;
  selectedNo.value = null;
};

const [emblaRef, emblaApi] = EmblaCarousel(
  {
    loop: false,
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  },
  [
    WheelGesturesPlugin({ wheelDraggingClass: "is-wheel-dragging" })
  ]
);

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, "0")}月${String(d.getDate()).padStart(2, "0")}日`;
};
const calcAge = (dateStr) => {
  if (!dateStr) return "";
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasBirthdayPassed) {
    age--;
  }
  return age;
};
</script>
<template>
  <div class="container">
    <span class="title-span">
      <h1>Acotrs</h1><span class="search-icon" @click="openSearch()"><i
          class="fa-solid fa-magnifying-glass"></i>探す</span>
    </span>
    <div class="embla" ref="emblaRef">
      <div class="embla__container" v-if="actors.length">
        <div v-for="a in actors" :key="a.acotr_no" class="embla__slide" @click="openActor(a.actor_no)">
          <img :src="a.image_path" />
          <div class="actor-row">
            <span class="actor-name">{{ a.name }}</span>
            <span class="actor-age">（{{ calcAge(a.date_of_birth) }}歳）</span>
          </div>
          <span class="data">{{ formatDate(a.date_of_birth) }}</span>
          <span class="data">国籍：{{ a.nationality }}</span>
        </div>
      </div>
      <EmptyResultCard v-else label="該当する俳優が見つかりませんでした" />
    </div>
    <Popup :type="popupType" :No="selectedNo" :allMovies="allMovies" :allActors="allActors" @close="closePopup" @change="({ type, No }) => {
      popupType = type;
      selectedNo = No;
    }" @search="onSearch" />
  </div>
</template>

<style scoped>
.title-span {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 30px 0 30px;
}

.container h1 {
  text-align: left;
}

.search-icon {
  font-size: 15px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

span {
  display: block;
}

.embla__slide {
  flex: 0 0 200px;
  width: 200px;
  box-sizing: border-box;
  height: 250px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform: none;
  opacity: 1;
  margin: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.embla__slide:hover {
  transform: scale(1.10);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.embla {
  overflow: hidden;
  padding: 32px 0;
}

.embla__container {
  display: flex;
  gap: 16px;
  margin: 0 16px;
}

 .embla__slide img {
  width: 170px;
  height: 160px;
  object-fit: cover;
  object-position: top;
  border-radius: 6px;
    margin-top: 10px;
}

.embla.is-wheel-dragging {
  cursor: grabbing;
}

.actor-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 170px;
}

.actor-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
}

.actor-age {
  flex-shrink: 0;
  font-size: 14px;
}

.data {
  text-align: left;
  width: 170px;
}
</style>
