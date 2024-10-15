<template>
  <header-item/>
  <div class="auth">
    <LoginItem v-if="!isToggle" :isToggle="isToggle" @toggle="handleToggle" />
    <RegisterItem v-else :isToggle="isToggle" @toggle="handleToggle" />
  </div>
</template>

<script>
import LoginItem from "@/components/auth/LoginItem.vue";
import RegisterItem from "@/components/auth/RegisterItem.vue";
import HeaderItem from '@/components/layouts/HeaderItem.vue';

export default {
  data() {
    return {
      isToggle: false,
    };
  },
  components: {
    LoginItem,RegisterItem,
    HeaderItem
  },
  methods: {
    handleToggle(newToggle) {
      this.isToggle = newToggle;
      if(this.isToggle){
        this.$router.push({ query: { q: "signup" } });
        document.title = "Login";
      }else{
        this.$router.push({ query: { q: "login" } });
        document.title = "Sign Up";
      }
    },
  },
  mounted() {
    if (this.$route.query.q == "login" || !this.$route.query.q) {
      document.title = "Login";
      this.isToggle = false;
    } else {
      document.title = "Sign Up";
      this.isToggle = true;
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/pages/auth.scss";
</style>