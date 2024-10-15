<template>
  <div class="container">
    <div class="category-bars pt-50">
      <router-link to="/">
        {{ $t("home") }}
      </router-link>
      <i class="fa-solid fa-angles-right"></i>
      <p>My Account</p>
    </div>
    <div class="row">
      <div class="col-9">
        <div class="profile-container">
          <div class="profile-header">
            <div class="user-info">
              <div class="profile-pic">
              <img v-if="!user.img" src="https://via.placeholder.com/60" alt="Profile Picture" />
              <img v-else :src="user.img" alt="Profile Picture" />
            </div>
            <div class="profile-info">
              <div><span>Full Name: </span>{{ user.full_name }}</div>
              <div><span>Username: </span>{{ user.login }}</div>
              <div><span>Email: </span>{{ user.email }}</div>
            </div>
            </div>
            <div class="profile-stats">
              <div class="stat">
                <i class="fas fa-upload"></i>
                <span>UPLOADS</span>
                <span class="count">{{ user?.uploads?.length }}</span>
              </div>
              <div class="stat">
                <i class="fas fa-heart"></i>
                <span>LIKES</span>
                <span class="count">{{user?.likes?.length}}</span>
              </div>
              <div class="stat">
                <i class="fas fa-download"></i>
                <span>DOWNLOADS</span>
                <span class="count">{{user?.downloads?.length}}</span>
              </div>
              <div class="stat">
                <i class="fas fa-trophy"></i>
                <span>BADGES</span>
                <span class="count">0</span>
              </div>
              <div class="badges-btn">
              <button class="btn">BADGES</button>
            </div>
            </div>
            
          </div>
        </div>
        <div class="profile-footer">
          <button class="btn">FILTER</button>
          <button class="btn">EDIT PROFILE INFO</button>
        </div>
        {{  user }}
      </div>
      <div class="col-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      user: {},
    };
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