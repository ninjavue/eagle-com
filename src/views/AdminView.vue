<template>
  <VaLayout
    style="height: calc(100vh + 50px)"
    :left="{ absolute: breakpoints.smDown && isSidebarVisible }"
  >
    <template #top>
      <VaNavbar shadowed>
        <template #left>
          <VaButton
            preset="secondary"
            @click="isSidebarVisible = !isSidebarVisible"
          >
            <VaIcon
              :name="isSidebarVisible ? 'menu_open' : 'menu'"
              size="large"
            />
          </VaButton>
        </template>
        <template #right>
          <div style="display: flex; gap: 20px; margin-right: 30px">
            <button style="background: transparent; border:none;">
            <input type="checkbox" class="checkbox" id="checkbox" @click="toggleDarkMode"/>
            <label for="checkbox" class="checkbox-label">
              <i class="fas fa-moon"></i>
              <i class="fas fa-sun"></i>
              <span class="ball"></span>
            </label>
          </button>
            <router-link to="/">
              <VaButton icon="home" round color="secondary" />
            </router-link>

            <VaBadge
              class="mr-6"
              overlap
              :text="types?.length"
              :offset="[-2, 2]"
            >
              <VaButton
                round
                color="secondary"
                icon="notifications"
                @click="showNewProduct = !showNewProduct"
              />
            </VaBadge>
            
          </div>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaSidebar v-model="isSidebarVisible">
        <router-link
          v-for="{ title, icon, link } in menu"
          :key="icon"
          :to="`/admin/${link}`"
        >
          <VaSidebarItem id="link">
            <VaSidebarItemContent>
              <VaIcon :name="icon" />
              <VaSidebarItemTitle> {{ title }} </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </router-link>
        <VaSidebarItem class="mt-a mb-30" @click="showModal = true">
          <VaSidebarItemContent class="item-content">
            <VaIcon name="logout" />
            <VaSidebarItemTitle> Logout </VaSidebarItemTitle>
          </VaSidebarItemContent>
        </VaSidebarItem>
      </VaSidebar>
    </template>

    <template #content>
      <main class="content">
        <VaCard class="card">
          <router-view></router-view>
        </VaCard>
      </main>
    </template>
  </VaLayout>
  <VaModal v-model="showModal" hide-default-actions overlay-opacity="0.2" blur>
    <template #header>
      <h3 class="text-danger">Diqqat <VaIcon name="warning" /></h3>
    </template>
    <div class="mt-8">Tizimdan chiqishni istaysizmi?</div>
    <template #footer>
      <VaButton color="danger" class="mr-2" @click="showModal = false">
        Yo'q
      </VaButton>
      <VaButton @click="handleLogout"> Ha </VaButton>
    </template>
  </VaModal>

  <VaModal
    v-model="showNewProduct"
    fullscreen
    hide-default-actions
    style="position: fixed"
    :class="isDarkMode?'dark':''"
  >
    <NewProduct />
    <VaButton
      @click="showNewProduct = false"
      color="danger"
      style="position: fixed; bottom: 20px; right: 40px"
      >{{$t('close')}}</VaButton
    >
  </VaModal>
</template>
  
  <script>
import NewProduct from "@/components/new/newProduct.vue";
import { ref } from "vue";
import { useBreakpoint } from "vuestic-ui";

export default {
  components: {
    NewProduct,
  },
  setup() {
    const breakpoints = useBreakpoint();
    const isSidebarVisible = ref(true);
    if (window.screen.width < 1024) {
      isSidebarVisible.value = false;
    }
    return {
      breakpoints,
      isSidebarVisible,
    };
  },

  data() {
    return {
      menu: [
        { icon: "dashboard", title: "Dashboard", link: "dashboard" },
        { icon: "list", title: "Kategoriyalar", link: "categories" },
        { icon: "image", title: "Rasmlar", link: "product" },
        { icon: "person", title: "Admin", link: "users" },
        { icon: "people", title: "Foydalanuvchilar", link: "allusers" },
      ],
      showNewProduct: false,
      showModal: false,
    };
  },
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
    types() {
      const typesWithNumbers = this.$store.getters.products
        .map((type, index) => {
          const user = this.$store.getters.users.find(
            (user) => user.id === type.userId
          );
          return user
            ? {
                ...type,
                N: index + 1,
                author: user.full_name,
                userStatus: user.status,
              }
            : null;
        })
        .filter((type) => type !== null && type.view === false);

      return typesWithNumbers;
    },
  },
  methods: {
    handleLogout() {
      this.$cookies.remove("accessToken");
      localStorage.removeItem("eagle_token");
      this.showModal = false;
      window.location.reload();
    },
    toggleDarkMode() {
      this.$store.dispatch("toggleDarkMode")
    },
  },
  mounted() {
    this.$store.dispatch("getProducts");
    document.title = "Dashboard - Eagle.com";
    const token = this.$cookies.get("accessToken");
    if (!token) {
      localStorage.removeItem("eagle_token");
    }
  },
};
</script>
  
  <style lang="scss">
@import "@/styles/pages/admin.scss";
</style>