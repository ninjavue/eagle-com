<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <div v-if="isLoading" class="loading">
      <div class="loader"></div>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isLoading"]),
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
  },
  created() {
    this.$store.dispatch("setLoading", true);
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.$store.dispatch("setLoading", false);
      }, 1000);
    });
  },
};
</script>

<style lang="scss">
@import "./styles/app.scss";
.dark-mode {
  background-color: #121212;
  color: white;
  min-height: 100vh;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 100vh;
}
.loader {
  width: 100px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #ffa516 94%, #0000) top/8px 8px
      no-repeat,
    conic-gradient(#0000 30%, #ffa516);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
