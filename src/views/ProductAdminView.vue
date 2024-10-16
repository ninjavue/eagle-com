<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput v-model="filter" class="col-6" placeholder="Product qidirish..." />
    <VaButton class="ml-a" @click="handleModal">Product qo'shish</VaButton>
  </div>

  <VaDataTable
    class="table-crud"
    :items="types"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
  >
    <template #cell(img)="{ row }">
      <div class="cat-img">
        <img :src="`${row.rowData.img}`" alt="img" />
      </div>
    </template>
    <template #cell(title)="{ row }">
      <div style="max-width: 200px; text-wrap: wrap">
        {{ row.rowData.title }}
      </div>
    </template>
    <template #cell(text)="{ row }">
      <div style="max-width: 250px; text-wrap: wrap">
        {{ row.rowData.text.substring(0,150) }}...
      </div>
    </template>
    <template #cell(actions)="{ row }">
      <div class="table-btn">
        <VaButton
          round
          class="ml-3"
          color="primary"
          icon="edit"
          @click="editRow(row.rowData)"
        />
        <VaButton
          round
          icon="delete"
          class="ml-3"
          color="danger"
          @click="deleteRow(row.rowData)"
        />
      </div>
    </template>
    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination v-model="currentPage" :pages="pages" />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>
  <VaModal v-model="showModal" hide-default-actions overlay-opacity="0.2" blur :class="isDarkMode?'dark':''">
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
          max-rows="5"
          label="Product text"
          class="col-12 mt-3"
          placeholder="Start typing"
        />
        <div class="d-center">
          <div class="mt-3 col-6">
            <label for="">Categoryni tanlang</label>
            <select
              class="form-select"
              v-model="product.categoryId"
            >
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
                style="text-transform:uppercase"
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
          <img :src="imageUrl" alt="photo" style="max-width: 200px" />
        </div>
        <div class="mt-20">
          <VaButton color="danger" class="mr-5" @click="showModal = false">
            Bekor qilish
          </VaButton>
          <VaButton type="submit">
            {{ isUpdated ? "Tahrirlash" : "Kiritish" }}
          </VaButton>
        </div>
      </VaForm>
    </div>
  </VaModal>
</template>
        
      <script>
import { defineComponent } from "vue";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default defineComponent({
  data() {
    const users = [];
    const columns = [
      { key: "N", sortable: true, width: "30px" },
      { key: "img", sortable: true, width: "60px" },
      { key: "title", sortable: true, width: "200px" },
      { key: "text", sortable: true, width: "250px" },
      { key: "quality", sortable: true, width: "70px" },
      { key: "like", sortable: true, width: "70px" },
      { key: "download", sortable: true, width: "100px" },
      { key: "date", sortable: true, width: "100px" },
      { key: "actions", width: "150px" },
    ];

    return {
      text: "",
      items: users,
      columns,
      perPage: 3,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      product: {
        img: "",
        title: "",
        text: "",
        quality: "",
        categoryId: "",
        created_at: "",
      },
      isError: false,
      isUpdated: false,
      id: "",
      isShow: "",
      file: null,
      imageUrl: "",
      qualitys:[
        {
          title:"hd"
        },
        {
          title:"4k"
        },
        {
          title:"5k"
        },
        {
          title:"8k"
        },
      ]
    };
  },

  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    },
    categories() {
      return this.$store.getters.categories;
    },
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    types() {
      const typesWithNumbers = this.$store.getters.products.map(
        (type, index) => {
          return {
            ...type,
            N: index + 1,
            date: this.formatDate(type.created_at)
          };
        }
      );

      return typesWithNumbers;
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
    handleModal() {
      this.showModal = true;
      this.isUpdated = false;
      this.product = {};
      this.isError = false;
      this.imageUrl = "";
    },
    formatDate(proxyDate) {
      try {
        const { nanoseconds, seconds } = proxyDate;
        const milliseconds = seconds * 1000 + nanoseconds / 1e6;
        const date = new Date(milliseconds);

        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString();
        const year = date.getUTCFullYear();
        return `${day}.${month}.${year}`;
      } catch (error) {
        console.log(error);
      }
    },
    async handleSubmit() {
      if (!this.isUpdated) {
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
      } else {
        if (
          this.product.title &&
          this.product.text &&
          this.product.quality &&
          this.product.categoryId
        ) {
          if (this.file) {
            const storageRef = ref(storage, `images/${this.file.name}`);
            const snapshot = await uploadBytes(storageRef, this.file);
            console.log("Fayl muvaffaqiyatli yuklandi!", snapshot);
            const downloadURL = await getDownloadURL(storageRef);
            this.product.img = downloadURL;
          }
          this.$store.dispatch("editProduct", this.product);
          this.product = {};
          this.showModal = false;
          this.isUpdated = false;
          this.$vaToast.init({
            message: "Malumot tahrirlandi",
            color: "success",
            position: "bottom-right",
          });
        } else {
          this.text = "Maydonlarni to'liq to'ldirish shart!";
          this.isError = true;
        }
      }
    },
    editRow(row) {
      this.$store
        .dispatch("getByIdProduct", row.id)
        .then((res) => {
          this.product = res;
          this.imageUrl = res.img;
          this.id = res.id;
          this.isUpdated = true;
          this.showModal = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$store.dispatch("deleteCategory", row.id);
      this.$vaToast.init({
        message: "Malumot o'chirildi",
        color: "success",
        position: "bottom-right",
      });
    },
  },
  mounted() {
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getCategories");
    if (window.screen.height >= 1080) {
      this.perPage = 8;
    }
  },
});
</script>
      <style lang="scss">
.va-data-table .va-data-table__table .va-data-table__table-td {
  & div {
    &.table-btn {
      padding-bottom: 8px;
      & button {
        margin-top: -6px;
      }
    }
  }
}
.cat-img {
  width: 60px;
  height: 60px;
  & img {
    width: 100%;
    height: 100%;
  }
}
</style>