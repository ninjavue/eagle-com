<template>
  <div class="container">
    <div class="category-bars pt-50">
          <router-link to="/">
            {{ $t('home')}}
          </router-link>
          <i class="fa-solid fa-angles-right"></i>
          <p>{{searchText}}</p>
      </div>
    <div class="search">
        <div class="not-found" v-if="!products">
            <img src="@/assets/img/not.jpg" alt="">
        </div>
        <CardItem v-else :products="products" :title="searchText + ' wallpapers'" />
    </div>
  </div>
</template>

<script>
import CardItem from '@/components/card/CardItem.vue';
export default {
  components: { CardItem },
    data() {
        return {
            searchText:""
        }
    },
    computed:{
        products(){
            const allProducts = Array.from(this.$store.getters.products);
                if (!this.searchText) {
                return allProducts
            }
               return allProducts.filter(product => 
                JSON.parse(JSON.stringify(product)).title.toLowerCase().includes(this.searchText.toLowerCase()))
                
        }
    },
    methods:{

    },
    mounted(){
        this.$store.dispatch("getProducts")
       const text = this.$route.query.query || ''
       if(text){
        this.searchText = text 
       }
    },
    watch: {
        '$route.query.query'(newQuery) {
            this.searchText = newQuery || ''
        }
    }
}
</script>

<style lang="scss">
@import "@/styles/pages/image.scss"
</style>