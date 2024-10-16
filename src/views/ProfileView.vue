<template>
  <div class="container">
    <div class="category-bars pt-50">
      <router-link to="/">
        {{ $t("home") }}
      </router-link>
      <i class="fa-solid fa-angles-right"></i>
      <p>{{ $t("my-account") }}</p>
    </div>
    <div class="row">
      <div class="col-3 relative">
        <div class="account-info">
          <img src="@/assets/img/giprege.jpeg" alt="" class="account-img" />
          <img :src="user.img" :alt="user.login" class="account-avatar" />
          <div class="account-name">
            {{ user.full_name }}
          </div>
          <div class="account-email">
            <div>Email</div>
            <a :href="`mailto:${user.email}`">{{ user.email }}</a>
          </div>
          <div class="account-username">
            <div>Username</div>
            <div>{{ user.login }}</div>
          </div>
          <div class="account-group">
            <button
              :class="isToggle == 'uploads' ? 'active' : ''"
              @click="isToggle = 'uploads'"
            >
              Uploads
            </button>
            <button
              :class="isToggle == 'Likes' ? 'active' : ''"
              @click="fetchLikedProducts('Likes')"
            >
              Likes
            </button>
            <button
              :class="isToggle == 'Favorites' ? 'active' : ''"
              @click="fetchLikedProducts('Favorites')"
            >
              Favorites
            </button>
            <button
              :class="isToggle == 'downloads' ? 'active' : ''"
              @click="fetchLikedProducts('downloads')"
            >
              Downloads
            </button>
          </div>
        </div>
      </div>
      <div class="col-9">
        <div class="account-products">
          <h3 class="account-products-title">
            <div>{{ isToggle }}</div>
            <button @click="handleModal" v-if="isToggle == 'uploads'">
              {{ $t("add-photo") }}
            </button>
          </h3>
          <CardProfile v-if="filteredProducts?.length > 0" :products="filteredProducts" />
          <img v-else src="@/assets/img/empty-data.png" alt="" />
        </div>
      </div>
    </div>
  </div>

  <VaModal
    v-model="showModal"
    fullscreen
    hide-default-actions
    :class="isDarkMode ? 'dark' : ''"
  >
    <template #header>
      <h2>Product qo'shish</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      {{ text }}
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        <VaInput
          v-model="product.title"
          class="col-12"
          label="Title"
          required
        />
        <VaTextarea
          v-model="product.text"
          autosize
          max-rows="20"
          label="Product text"
          class="col-12 mt-3 textarea-p"
          placeholder="Start typing"
        />
        <div class="d-center">
          <div class="mt-3 col-6">
            <label for="">Categoryni tanlang</label>
            <select class="form-select" v-model="product.categoryId">
              <option
                v-for="item of categories"
                :key="item.id"
                :value="item.id"
              >
                {{ item.title }}
              </option>
            </select>
          </div>
          <div class="mt-3 col-5 ml-a">
            <label for="">Sifatni tanlang</label>
            <select
              class="form-select"
              aria-label="Default select example"
              v-model="product.quality"
            >
              <option selected disabled>Rasm sifatini tanlang</option>
              <option
                v-for="item of qualitys"
                :key="item.title"
                :value="item.title"
                style="text-transform: uppercase"
              >
                {{ item.title }}
              </option>
            </select>
          </div>
        </div>
        <VaInput
          class="mt-3 col-12"
          type="file"
          @change="onFileChange"
          label="Product photo"
          required
        />
        <div v-if="imageUrl" class="mt-10">
          <img :src="imageUrl" alt="photo" style="max-width: 500px" />
        </div>
        <div style="display: flex; justify-content: right; align-items: right">
          <div class="mt-20">
            <VaButton color="danger" class="mr-5" @click="showModal = false">
              {{ $t("close") }}
            </VaButton>
            <VaButton type="submit">
              {{ $t("add-photo") }}
            </VaButton>
          </div>
        </div>
      </VaForm>
    </div>
  </VaModal>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import CardProfile from "@/components/card/CardProfile.vue";
export default {
  components:{CardProfile},
  data() {
    return {
      id: "",
      userId: "",
      user: {},
      isToggle: "uploads",
      showModal: false,
      imageUrl: "",
      qualitys: [
        {
          title: "hd",
        },
        {
          title: "4k",
        },
        {
          title: "5k",
        },
        {
          title: "8k",
        },
      ],
      file: null,
      isError: false,
      product: {},
    };
  },
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
    categories() {
      return this.$store.getters.categories;
    },
    products() {
      const id = this.$cookies.get('accessToken')
      return this.$store.getters.products.filter(product => product.userId == id);
    },
    filteredProducts() {
      const userId = this.$cookies.get('accessToken');
      const user = this.$store.getters.users.find(user => user.id === userId);
      if (this.isToggle === 'Likes' && user) {
        return this.$store.getters.products.filter(product => user.likes.includes(product.id));
      }else if(this.isToggle === 'Favorites' && user){
        return this.$store.getters.products.filter(product => user.favorites.includes(product.id));
      }else if(this.isToggle === 'downloads' && user){
        return this.$store.getters.products.filter(product => user.downloads.includes(product.id));
      }
      return this.products;
    },
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    },
    async base64Decode() {
      try {
        let base64 = this.$cookies.get("u_token");
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
          window.location.href = "/auth";
          console.log("Token mavjud emas");
        }
      } catch (error) {
        console.error("Xato yuz berdi:", error);
      }
    },
    async handleSubmit() {
      const normalObject = Object.fromEntries(Object.entries(this.user));
      this.product.userId = normalObject.id
      if (
        this.product.title &&
        this.product.text &&
        this.product.quality &&
        this.product.categoryId &&
        this.file
      ) {
        const storageRef = ref(storage, `images/${this.file.name}`);
        const snapshot = await uploadBytes(storageRef, this.file);
        console.log("Fayl muvaffaqiyatli yuklandi!", snapshot);
        const downloadURL = await getDownloadURL(storageRef);
        this.product.created_at = new Date();
        this.product.like = "0";
        this.product.download = "0";
        this.product.img = downloadURL;
        this.product.status = false;
        this.product.view = false;
        this.$store
          .dispatch("postProduct", this.product)
          .then(() => {
            this.showModal = false;
            this.product = {};
            this.$vaToast.init({
              message: "Malumot qo`shildi",
              color: "success",
              position: "bottom-right",
            });
            this.$store.dispatch('getProducts')
          })
          .catch((err) => {
            console.log(err);
            this.$vaToast.init({
              message: "Malumot qo`shilmadi",
              color: "danger",
              position: "bottom-right",
            });
          });
      } else {
        this.text = "Maydonlarni to'liq to'ldirish shart!";
        this.isError = true;
      }
    },
    handleModal() {
      this.showModal = true;
      this.product = {};
      this.isError = false;
      this.imageUrl = "";
    },
    async fetchLikedProducts(text) {
      this.isToggle = text
    },
  },
  mounted() {
    const normalObject = Object.fromEntries(Object.entries(this.user));
    this.id = normalObject.id
    this.base64Decode();
    this.$store.dispatch("getCategories");
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getUsers");
  },
};
</script>

<style lang="scss">
@import "@/styles/pages/image.scss";
@import "@/styles/pages/profile.scss";
</style>