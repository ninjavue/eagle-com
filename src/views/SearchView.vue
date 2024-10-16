<template>
  <div class="container">
    <div class="category-bars pt-50">
      <router-link to="/">
        {{ $t("home") }}
      </router-link>
      <i class="fa-solid fa-angles-right"></i>
      <p>{{ searchText }}</p>
    </div>
    <div class="search">
      <div class="not-found" v-if="!products">
        <img src="@/assets/img/not.jpg" alt="" />
      </div>
      <CardItem
        v-else
        :products="products"
        :title="searchText + ' wallpapers'"
      />
    </div>
  </div>
</template>

<script>
import CardItem from "@/components/card/CardItem.vue";
export default {
  components: { CardItem },
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    products() {
      const allProducts = Array.from(this.$store.getters.products);
      const allCategories = Array.from(this.$store.getters.categories);
      const activeProducts = allProducts.filter((product) => product.status);

      if (!this.searchText) {
        return activeProducts;
      }

      const searchTextLower = this.searchText.toLowerCase();
      const matchedCategory = allCategories.find((category) =>
        category.title.toLowerCase().includes(searchTextLower)
      );

      if (matchedCategory) {
        return activeProducts.filter(
          (product) => product.categoryId === matchedCategory.id
        );
      }
      return activeProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {},
  mounted() {
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getCategories");
    const text = this.$route.query.query || "";
    if (text) {
      this.searchText = text;
    }
  },
  watch: {
    "$route.query.query"(newQuery) {
      this.searchText = newQuery || "";
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/pages/image.scss";
</style>