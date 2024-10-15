<template>
  <div>
    <VaCard class="relative">
      <VaProgressBar class="auth-progress" v-show="isLoading" indeterminate />
      <h2 class="mb-10 va-h5 text-blue-800">Sign Up</h2>
      <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
        Login yoki Parol xato!
      </VaAlert>
      <VaForm @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <VaInput
          stateful
          label="Full Name"
          v-model="auth.full_name"
          required
          :rules="[(v) => !!v || 'Full Name is required.']"
        />
        <VaInput
          stateful
          label="Username"
          v-model="auth.login"
          required
          :rules="[(v) => !!v || 'Username is required.']"
        />
        <VaInput
          stateful
          label="Email"
          v-model="auth.email"
          required
          :rules="[(v) => !!v || 'Email is required.']"
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
          Do you have an account?
          <span class="auth-link" @click="toggle"> Log in</span>
        </div>
        <VaButton type="submit">
          <VaIcon
            class="mr-2"
            name="loop"
            spin="counter-clockwise"
            v-if="isLoading"
          />
          <span v-else>Sign Up</span>
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
      this.$emit("toggle", !this.isToggle);
    },
    generateToken(id) {
      const data = [
        {
          userId: id,
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
        if (
          this.auth.full_name &&
          this.auth.email &&
          this.auth.login &&
          this.auth.password
        ) {
          this.auth.img =
            "https://aui.atlassian.com/aui/8.8/docs/images/avatar-person.svg";
          this.auth.downloads = [];
          this.auth.likes = [];
          this.auth.favorites = [];
          this.auth.created_at = new Date();
          this.auth.status = "active";

          this.$store
            .dispatch("postUser", this.auth)
            .then((res) => {
              if (res.status == "active") {
                const token = this.generateToken(res.id);
                console.log(token)
                localStorage.setItem("u_token", token);
                window.location.href = "/profile";
              }
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