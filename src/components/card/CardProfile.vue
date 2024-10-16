<template>
    <div class="card1" style="width: 100%">
      <div class="row">
          <div class="col-4 col-xl-6  col-md-12" v-for="item,i of products" :key="i">
              <div :class="['card1-box', item.quality === '4k' || item.quality === '4K' ? 'fourk' : '', item.quality === '5k' || item.quality === '5K' ? 'fivek' : '', item.quality === '8k' || item.quality === '8K' ? 'eatk' : '']">
                  <span>
                      <p style="text-transform:uppercase">{{item.quality}}</p>
                  </span>
                  <router-link :to="`/wallpaper/${item.title}/${item.id}`">
                      <div class="card1-img">
                          <img :src="`${item.img}`" alt="">
                          <div class="action">
                              <div class="like">
                                  <p>{{item.like}}</p>
                                  <i class="fa-solid fa-heart"></i>
                              </div>
                              <div class="like">
                                  <p>{{item.download}}</p>
                                  <i class="fa-solid fa-download"></i>
                              </div>
                          </div>
                      </div>
                  </router-link>
                  <div class="card1-title d-center">
                      {{item.title.substring(0,25)}} <p v-if="item.title.length > 34">...</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
      props: {
      products: Array
    },
  }
  </script>
  
  <style lang="scss">
  @import "../../styles/card.scss";
  </style>