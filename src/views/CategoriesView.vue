<template>
  <div class="container">
    <div class="category">
      <div class="category-bars">
        <router-link to="/">
          {{ $t("home") }}
        </router-link>
        <i class="fa-solid fa-angles-right"></i>
        <p>{{ $t("categories") }}</p>
      </div>
      <div class="row">
        <div class="col-9">
          <div class="row">
            <div class="col-3 p-5" v-for="(category, i) of categories" :key="i">
              <router-link
                :to="`/categories/${category.title}/${category.id}`"
                class="category-card"
              >
                <div  v-if="!imageLoaded"  class="load_img" >
                  <img :src="require('@/assets/img/empty-photo.png')"
                  alt="loading"
                />
                </div>

                <img
                  v-show="imageLoaded"
                  style="width: 100%"
                  :src="category.img"
                  alt="category image"
                  @load="onImageLoad"
                />
                <div
                  class="category-card-title"
                  :style="`background-color: ${category.color}`"
                >
                  {{ category.title }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageLoaded: false,
    };
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
  },
  methods: {
    onImageLoad() {
    this.imageLoaded = true
  },
  },
  mounted() {
    document.title = "Categories - Eagle.com";
    this.$store.dispatch("getCategories");
  },
};
</script>

<style lang="scss">
@import "@/styles/pages/categories.scss";
.load_img{
  width: 100%; 
  height: 180px; 
  border: 1px solid #ccc;
  border-bottom: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  & img{
    width: 70%;
  }
}
</style>
