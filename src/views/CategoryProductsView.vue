<template>
  <div class="container">
    <div class="category">
        <div class="category-bars">
        <router-link to="/">
          {{ $t('home')}}
        </router-link>
        <i class="fa-solid fa-angles-right"></i>
        <router-link to="/categories">
            {{  $t('categories') }}
        </router-link>
        <i class="fa-solid fa-angles-right"></i>
        <p style="text-transform: capitalize ">{{title}}</p>
      </div>
    </div>
      <div v-if="products.length == 0" style="display:flex; justify-content: center; align-items: center">
        <img  src="@/assets/img/box.png" alt="">
      </div>
      <CardItem v-else :products="products" :title="title" />
  </div>
</template>

<script>
import CardItem from '@/components/card/CardItem.vue';

export default {
    components:{
        CardItem
    },
    data() {
      return {
        id: "",
        title:""
      }
    },
    computed:{
      products(){
        return this.$store.getters.products
      }
    },
    mounted(){
      this.id = this.$route.params.id;
      this.title = this.$route.params.title;
      document.title = this.title?.charAt(0).toUpperCase() + this.title?.slice(1)
      if(this.id){
        this.$store.dispatch("getCategoryWithProduct", this.id)
      }
    }
}
</script>

<style lang="scss">
.category{
    margin: 40px 0;
    &-bars{
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 10px;
        color: #333;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 40px;
        margin-left: 8px;
        & a{
            color: hsl(22, 94%, 49%);
            text-decoration: none;
            &:hover{
                text-decoration: underline;
            }
        }
    }
}
</style>