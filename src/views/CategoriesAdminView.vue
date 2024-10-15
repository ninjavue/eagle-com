<template>
  <div class="d-flex align-center justify-center mb-30">
    <VaInput
      v-model="filter"
      class="col-6"
      placeholder="Category qidirish..."
    />
    <VaButton class="ml-a" @click="handleModal">Category qo'shish</VaButton>
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
  <VaModal v-model="showModal" hide-default-actions overlay-opacity="0.2" blur>
    <template #header>
      <h2>Category qo'shish</h2>
    </template>
    <VaAlert color="#fdeae7" text-color="#940909" v-if="isError" closeable>
      {{ text }}
    </VaAlert>
    <div class="mt-10">
      <VaForm tag="form" @submit.prevent="handleSubmit">
        <VaInput
          v-model="category.title"
          class="col-12"
          label="Title"
          required
        />
        <VaInput
          class="mt-3 col-12"
          type="file"
          @change="onFileChange"
          label="Category photo"
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
      { key: "N", sortable: true, width: "60px" },
      { key: "img", sortable: true, width: "60px" },
      { key: "title", sortable: true, width: "300px" },
      { key: "actions", width: "150px" },
    ];

    return {
      text: "",
      items: users,
      columns,
      perPage: 4,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      category: {
        img: "",
        title: "",
        color: "",
        created_at: "",
      },
      isError: false,
      isUpdated: false,
      id: "",
      isShow: "",
      file: null,
      imageUrl: "",
    };
  },

  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    types() {
      const typesWithNumbers = this.$store.getters.categories.map(
        (type, index) => {
          return {
            ...type,
            N: index + 1,
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
    handlePassword(id) {
      if (this.isShow === id) {
        this.isShow = "";
      } else {
        this.isShow = id;
      }
    },
    handleModal() {
      this.category = {};
      this.showModal = true;
      this.isUpdated = false;
      this.isError = false;
      this.imageUrl = "";
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    },
    async handleSubmit() {
      if (!this.isUpdated) {
        if (this.category.title && this.file) {
          for (const cat of this.types) {
            if (cat.title.trim() === this.category.title.trim()) {
              this.$vaToast.init({
                message: "Siz kiritgan kategoriya bazada bor.",
                color: "danger",
                position: "top-right",
              });
              return;
            }
          }
          this.category.color = `rgb(${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )})`;

          const storageRef = ref(storage, `images/${this.file.name}`);
          const snapshot = await uploadBytes(storageRef, this.file);
          console.log("Fayl muvaffaqiyatli yuklandi!", snapshot);
          const downloadURL = await getDownloadURL(storageRef);
          this.category.created_at = new Date();
          this.category.img = downloadURL;
          this.$store
            .dispatch("postCategory", this.category)
            .then(() => {
              this.showModal = false;
              this.category = {};
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
        if (this.category.title) {
          if (this.file) {
            const storageRef = ref(storage, `images/${this.file.name}`);
            const snapshot = await uploadBytes(storageRef, this.file);
            console.log("Fayl muvaffaqiyatli yuklandi!", snapshot);
            const downloadURL = await getDownloadURL(storageRef);
            this.category.img = downloadURL;
          }
          this.$store.dispatch("editCategory", this.category);
          this.category = {};
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
        .dispatch("getByIdCategory", row.id)
        .then((res) => {
          this.category = res;
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