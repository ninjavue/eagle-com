<template>
  <div class="container">
    <div class="category-bars pt-50">
      <router-link to="/">
        {{ $t("home") }}
      </router-link>
      <i class="fa-solid fa-angles-right"></i>
      <p>{{ $t('my-account') }}</p>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="account-info">
          <img src="@/assets/img/giprege.jpeg" alt="" class="account-img">
          <img :src="user.img" :alt="user.login" class="account-avatar">
          <div class="account-name">
            {{ user.full_name }}
          </div>
          <div class="account-email">
            <div>Email</div>
            <a :href="`mailto:${user.email}`">{{user.email}}</a>
          </div>
          <div class="account-username">
            <div>Username</div>
            <div>{{user.login}}</div>
          </div>
          <div class="account-group">
            <button :class="isToggle == 'uploads'?'active':''" @click="isToggle = 'uploads'">
              Uploads
            </button>
            <button :class="isToggle == 'Likes'?'active':''" @click="isToggle = 'Likes'">
              Likes
            </button>
            <button :class="isToggle == 'Favorites'?'active':''" @click="isToggle = 'Favorites'">
              Favorites
            </button>
            <button :class="isToggle == 'downloads'?'active':''" @click="isToggle = 'downloads'">
              Downloads
            </button>
          </div>
        </div>
      </div>
      <div class="col-9">
        <div class="account-products">
          <h3 class="account-products-title">
            <div>{{ isToggle }}</div>
            <button @click="showModal = true" v-if="isToggle == 'uploads'">{{$t('add-photo')}}</button>
          </h3>
          <img src="@/assets/img/empty-data.png" alt="">
        </div>
      </div>
    </div>
  </div>

  <VaModal
    v-model="showModal"
    fullscreen
    hide-default-actions
    style="position: fixed"
    :class="isDarkMode?'dark':''"
  >
    <div style="position: fixed; bottom: 20px; right: 40px">
      <VaButton
      @click="showModal = false"
      color="danger"
      
      >{{$t('close')}}</VaButton>
    <VaButton
      @click="showModal = false"
      color="primary"
      style="margin-left: 10px;"
      >{{$t('add-photo')}}</VaButton>
      </div>
  </VaModal>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      user: {},
      isToggle:'uploads',
      showModal: false
    };
  },
  computed:{
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
  },
  methods: {
    async base64Decode() {
      try {
        let base64 = localStorage.getItem("u_token");
        if (base64) {
          let decodedString = await atob(base64);
          let parsedData = JSON.parse(decodedString);
          this.userId = parsedData[0].userId;
          this.$store
            .dispatch("getByIdUser", this.userId)
            .then((res) => {
              this.user = res;
            })
            .catch((err) => console.log(err));
        } else {
           window.location.href = "/auth"
          console.log("Token mavjud emas");
        }
      } catch (error) {
        console.error("Xato yuz berdi:", error);
      }
    },
  },
  mounted() {
    this.base64Decode();
  }
};
</script>

<style lang="scss">
@import "@/styles/pages/image.scss";
@import "@/styles/pages/profile.scss";
</style>