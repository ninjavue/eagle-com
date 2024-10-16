<template>
  <div class="home">
    <div class="cursel">
      <div class="cursel-form" >
        <input type="text" v-model="searchQuery" @keyup.enter="performSearch"  :placeholder="$t('bottomsearch')">
        <button @click="performSearch">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
    <div class="container">
      <CardItem :products="products" :title="title" />
    </div>
  </div>
</template>

<script>
import CardItem from '@/components/card/CardItem.vue'
export default {
  components: { CardItem },
  data() {
    return {
      text: "",
      searchQuery:""
    }
  },
  computed:{
    products(){
      return this.$store.getters.products.filter(product => product.status)
    },
    title() {
        return this.$t('latestWallpapers');
    }
  },
  methods:{
    performSearch() {
            if (this.searchQuery) {
                const url = `/search?query=${encodeURIComponent(this.searchQuery)}`;
                this.$router.push(url)
            }
        }
  },
  mounted() {
    document.title = "Eagle.com"
    this.$store.dispatch('getProducts')
    
  }
}
</script>

<style lang="scss">
@import '../styles/pages/home.scss';
</style>