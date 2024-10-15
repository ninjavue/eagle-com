<template>
  <div class="d-flex align-start justify-start mb-30">
    <VaInput v-model="filter" class="col-6" placeholder="Rasmni qidirish..." />
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
    <template #cell(status)="{ row }">
      <div class="table-btn">
        <VaButton
          class="ml-3"
          size="small"
          :color="row.rowData.status ? 'info' : 'danger'"
          style="text-transform: capitalize"
          @click="editRow(row.rowData)"
        >
          {{ row.rowData.status }}
        </VaButton>
      </div>
    </template>
    <template #cell(img)="{ row }">
      <div class="cat-img">
        <img :src="`${row.rowData.img}`" alt="img" />
      </div>
    </template>
    <template #cell(author)="{ row }">
      <VaButtonDropdown
        color="transparent"
        class="mr-2 mb-2 user_name"
        style="font-weight: normal"
        :label="row.rowData.author"
      >
        <div class="admin-accept">
          <div @click="editUser(row.rowData)">
            {{
              row.rowData.userStatus == "active"
                ? "Spam qilish"
                : "Spamdan chiqarish"
            }}
          </div>
          <div @click="showImage(row.rowData)">Rasmni ko'rish</div>
          <div @click="deleteRow(row.rowData)">O'chirish</div>
        </div>
      </VaButtonDropdown>
    </template>
    <template #cell(title)="{ row }">
      <div style="max-width: 200px; text-wrap: wrap">
        {{ row.rowData.title }}
      </div>
    </template>
    <template #cell(text)="{ row }">
      <div style="max-width: 250px; text-wrap: wrap">
        {{ row.rowData.text.substring(0, 150) }}...
      </div>
    </template>
    <template #cell(view)="{ row }">
      <div class="table-btn">
        <VaButton
          class="ml-3"
          size="small"
          :color="row.rowData.view ? 'success' : 'danger'"
          style="text-transform: capitalize"
          @click="viewRow(row.rowData)"
        >
          {{ row.rowData.view ? "Ko'rilgan" : "Ko'rilmagan" }}
        </VaButton>
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
  <VaModal v-model="showNewProduct" no-padding hide-default-actions>
    <template #content="{ ok }">
      <VaImage :ratio="16 / 9" :src="imageUrl" />
      <VaCardContent>
        {{ text }}
      </VaCardContent>
      <VaCardActions>
        <VaButton @click="ok" color="danger">Yopish</VaButton>
      </VaCardActions>
    </template>
  </VaModal>
</template>
          
        <script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    const users = [];
    const columns = [
      { key: "N", sortable: true, width: "30px" },
      { key: "img", sortable: true, width: "80px" },
      { key: "author", sortable: true, width: "150px" },
      { key: "title", sortable: true, width: "200px" },
      { key: "text", sortable: true, width: "250px" },
      { key: "quality", sortable: true, width: "70px" },
      { key: "status", sortable: true, width: "90px" },
      { key: "view", width: "150px" },
    ];

    return {
      text: "",
      items: users,
      columns,
      perPage: 5,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      showNewProduct: false,
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
    showImage(product) {
      this.showNewProduct = true;
      this.imageUrl = product.img;
      this.text = product.text;
    },
    editUser(row) {
      this.$store
        .dispatch("getByIdUser", row.userId)
        .then((res) => {
          
          const user = res;
          if (user.status == "active") {
            const text = user.full_name + "ni accounti block qilinsinmi!"
            const conf = confirm(text)
            if(conf) user.status = "block";
          } else {
            const text = user.full_name + "ni accounti blockdan chiqarilsinmi!"
            const conf = confirm(text)
            if(conf) user.status = "active";
          }
          this.$store.dispatch("editUser", user);
          this.$store.dispatch("getUsers");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editRow(row) {
      this.$store
        .dispatch("getByIdProduct", row.id)
        .then((res) => {
          res.status = !res.status;
          this.$store.dispatch("editProduct", res);
          this.$store.dispatch(
            "getUserWithProduct",
            this.$route.params.id || ""
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    viewRow(row) {
      this.$store
        .dispatch("getByIdProduct", row.id)
        .then((res) => {
          const text = res.title + " ko'rilgan deb belgilansinmi!"
          const conf = confirm(text)
          if(conf){
            res.view = !res.view;
            this.$store.dispatch("editProduct", res);
            this.$store.dispatch("getProducts");
            this.$vaToast.init({
              message: res.title + " ko'rilgan deb belgilandi",
              color: "success",
              position: "top-right",
          });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      const text = row.title + "ni o'chirmoqchimisiz!"
      const conf = confirm(text)
      if(conf){
        this.$store.dispatch("deleteCategory", row.id);
        this.$vaToast.init({
          message: "Malumot o'chirildi",
          color: "success",
          position: "top-right",
        });
      }else{
        this.$vaToast.init({
          message: "Malumot o'chirilmadi",
          color: "danger",
          position: "top-right",
        });
      }
      
    },
  },
  mounted() {
    this.$store.dispatch("getProducts");
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
.admin-link {
  font-weight: normal;
  color: #333;
  text-decoration: underline;
  &:hover {
    color: #0a0ee4;
  }
}
.user_name .va-button .va-button__content {
  font-weight: 400;
  &:hover {
    text-decoration: underline;
    color: red;
  }
}
.admin-accept {
  & div {
    cursor: pointer;
    padding: 8px 15px;
    margin-bottom: 8px;
    &:hover {
      background: #ccc;
      color: red;
    }
  }
}
.va-icon.material-icons.va-button__right-icon {
  display: none;
}
</style>