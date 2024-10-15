<template>
   <div>
    <HeaderItem/>
    <router-view/>
    </div> 
</template>

<script>
import HeaderItem from '@/components/layouts/HeaderItem.vue';

  export default {
  components: { HeaderItem },

  }
</script>

<style>

</style>