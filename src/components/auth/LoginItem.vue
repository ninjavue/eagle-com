<template>
  <div>
    <VaCard class="relative">
      <VaProgressBar class="auth-progress" v-show="isLoading" indeterminate />
      <h2 class="mb-10 va-h5 text-blue-800">Login</h2>
      <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
        Login yoki Parol xato!
      </VaAlert>
      <VaForm @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <VaInput
          stateful
          label="Username"
          v-model="auth.login"
          required
          :rules="[(v) => !!v || 'Username is required.']"
        />

        <VaInput
          stateful
          label="Parol"
          type="password"
          v-model="auth.password"
          required
          :rules="[asyncRule, (v) => !!v || 'Password is required.']"
        />
        <div>
          Open a new account?
          <span class="auth-link" @click="toggle"> Sign Up</span>
        </div>
        <VaButton type="submit">
          <VaIcon
            class="mr-2"
            name="loop"
            spin="counter-clockwise"
            v-if="isLoading"
          />
          <span v-else>Login</span>
        </VaButton>
      </VaForm>
    </VaCard>
  </div>
</template>
 
 <script>
export default {
  props: {
    isToggle: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      auth: {},
      isLoading: false,
      isError: false,
      localIsToggle: this.isToggle,
    };
  },
  methods: {
    toggle() {
      this.$emit('toggle', !this.isToggle)
    },
    generateToken() {
      const data = [
        {
          master: true,
          extensionId: "epiocemhmnlbhjplcgkofciegomcon",
          adblockerStatus: {
            DISPLAY: "enabled",
            FACEBOOK: "enabled",
            TWITTER: "enabled",
            REDDIT: "enabled",
            PINTEREST: "enabled",
            INSTAGRAM: "enabled",
            LINKEDIN: "disabled",
            CONFIG: "disabled",
          },
          version: "2.0.16",
          score: 200160,
        },
      ];
      const jsonString = JSON.stringify(data);
      const base64Token = btoa(jsonString);
      return base64Token;
    },
    handleSubmit() {
      this.isLoading = true;
      try {
        if (this.auth.login && this.auth.password) {
          this.$store
            .dispatch("checkAdmin")
            .then((res) => {
              res.map((admin) => {
                if (
                  admin.username == this.auth.login &&
                  admin.password == this.auth.password
                ) {
                  const token = this.generateToken();
                  this.$cookies.set("r_token", token);
                  localStorage.setItem("eagle_token", admin.id + token);
                  this.$cookies.set("accessToken", admin.id);
                  this.isLoading = false;
                  window.location.href = "/admin";
                } else {
                  this.auth.login = "";
                  this.auth.password = "";
                  this.isLoading = false;
                  this.isError = true;
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    const token = this.$cookies.get("accessToken");
    if (!token) {
      localStorage.removeItem("eagle_token");
    }
  },
};
</script>
 
 <style lang="scss">
@import "@/styles/pages/auth.scss";
</style>