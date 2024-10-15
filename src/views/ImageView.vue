<template>
  <div class="container">
    <div class="category-bars pt-50">
          <router-link to="/">
            {{ $t('home')}}
          </router-link>
          <i class="fa-solid fa-angles-right"></i>
          <p>{{title}}</p>
      </div>
    <div class="photo">
        <div class="row">
          <div class="col-9">
            <div class="row">
              <div class="col-7">
                <div class="photo-img">
                  <img :src="`${product.img}`" alt="">
                </div>
                <div class="btn-group">
                  <button class="btn" @click="likeImage(product)">
                    Like
                  </button>
                  <button  @click="downloadImage(product)" class="btn">
                    Download
                  </button>
                  <button class="btn">
                    Set as Background
                  </button>
                  <button class="btn" >
                    Add to Fovorite
                  </button>
                  <button class="btn" @click="downloadImage(product.img)">
                    add to folder
                  </button>
                </div>
              </div>
              <div class="col-5">
                <div class="photo-box">
                  <div class="photo-box-title">
                    {{product.title}}
                  </div>
                  <div class="photo-box-text">
                    {{product.text}}
                  </div>
                  <div class="photo-box-text mt-30">
                    Category: <router-link :to="`/categories/${category}/${product.categoryId}`" style="text-transform:capitalize;">{{category}}</router-link>
                  </div>
                  <div class="photo-box-text">
                    Uploaded: {{formatDate(product.created_at)}}
                  </div>
                  <div class="photo-box-text">
                    Dimensions: 7680x4320 (<span style="text-transform:uppercase;">{{product.quality}}</span> UltraHD)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">

          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id:"",
      title:"",
      product:{},
      category:""
    }
  },
  methods:{
     formatDate(proxyDate) {
      try {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const {nanoseconds, seconds} = proxyDate
        const milliseconds = seconds * 1000 + nanoseconds / 1e6
        const date = new Date(milliseconds)

        const day = date.getUTCDate().toString().padStart(2, '0')
        const month = (date.getUTCMonth() + 1).toString()
        const year = date.getUTCFullYear()
        return `${day}th ${months[month - 1]} ${year}`
      } catch (error) {
        console.log(error)
      }
    },
    formatCategory(id) {
      try {
        this.$store.dispatch("getByIdCategory", id).then(res => {
          this.category = res.title
        }).catch(err => console.log(err))
      } catch (error) {
        console.log(error)
        return null;
      }
    },
    async likeImage(product){
      try {
        let likes = JSON.parse(localStorage.getItem('like')) || []
        let checkLike = likes.includes(product.id)
        if (!checkLike) {
            likes.push(product.id)
            product.like = Number(product.like) + 1
            product.like = product.like.toString()
            this.$store.dispatch("editProduct", product)
        }
        localStorage.setItem('like', JSON.stringify(likes))
        
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async downloadImage(product) {
      try {
        product.download = Number(product.download) + 1;
        product.download = product.download.toString();
        this.$store.dispatch("editProduct", product)
        const a = document.createElement("a");
        a.href = product.img;
        a.download = "image.jpg"
        a.target = "_blank"
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Rasm yuklashda xatolik:", error);
      }
    }

  },
  mounted(){
    this.id = this.$route.params.id;
    this.title = this.$route.params.title;
    document.title = this.title
    if(this.id){
      this.$store.dispatch("getByIdProduct", this.id).then(res => {
        this.formatCategory(res.categoryId)
        this.product = res
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/pages/image.scss"
</style>