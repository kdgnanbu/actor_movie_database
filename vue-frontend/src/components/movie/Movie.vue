<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import EmblaCarousel from "embla-carousel-vue";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import Popup from "@/components/common/Popup.vue";
import EmptyResultCard from "@/components/common/EmptyResultCard.vue";

defineProps({
  movies: Array,
  actors: Array,
  allActors: Array,
  allMovies: Array
});

const popupType = ref(null);
const selectedNo = ref(null);

const emit = defineEmits(["search"]);

const onSearch = ({ type, conditions }) => {
  if (type !== "movie") return;
  emit("search", { type, conditions });
  closePopup();
};
const openMovie = (movieNo) => {
  popupType.value = "movie";
  selectedNo.value = movieNo;
};

const openSearchMovie = () => {
  popupType.value = "search-movie";
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
  [WheelGesturesPlugin({ wheelDraggingClass: "is-wheel-dragging" })]
);

onMounted(() => {
  if (!emblaApi.value) return;
  const container = emblaRef.value;
  let wheelDelta = 0;
  const threshold = 10000;
  const speed = 100;
  const onWheel = (e) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX > absY) {
      e.preventDefault();
      wheelDelta += e.deltaX;
      if (wheelDelta >= threshold) {
        emblaApi.value.scrollNext({ speed });
        wheelDelta = 0;
      } else if (wheelDelta <= -threshold) {
        emblaApi.value.scrollPrev({ speed });
        wheelDelta = 0;
      }
    }
  };
  container.addEventListener("wheel", onWheel, { passive: false });
});
</script>

<template>
  <div class="container">
    <span class="title-span">
      <h1>Movies</h1>
      <span class="search-icon" @click="openSearchMovie">
        <i class="fa-solid fa-magnifying-glass"></i> 探す
      </span>
    </span>
    <div class="embla" ref="emblaRef">
      <div class="embla__container" v-if="movies.length">
        <div v-for="movie in movies" :key="movie.movie_no" class="embla__slide" @click="openMovie(movie.movie_no)">
           <img :src="movie.image_path" />
        </div>
      </div>
      <EmptyResultCard v-else label="該当する映画が見つかりませんでした" />
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
  margin: 40px 30px 0;
}

.container h1 {
  margin: 0;
  font-size: 24px;
}

.search-icon {
  font-size: 15px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
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

.embla__slide {
  flex: 0 0 200px;
  height: 250px;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.embla__slide:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.embla__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.embla.is-wheel-dragging {
  cursor: grabbing;
}
</style>
