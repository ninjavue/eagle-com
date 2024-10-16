<template>
    <div class="d-flex align-center justify-between mb-30">
      <VaInput v-model="filter" class="col-6" placeholder="Product qidirish..." />
      <div class="admin-link" v-if="user.full_name">Muallif: {{ user?.full_name }}</div>
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
  </template>
          
        <script>
  import { defineComponent } from "vue"; 
  export default defineComponent({
    data() {
      const users = [];
      const columns = [
        { key: "N", sortable: true, width: "30px" },
        { key: "img", sortable: true, width: "80px" },
        { key: "title", sortable: true, width: "200px" },
        { key: "text", sortable: true, width: "250px" },
        { key: "status", sortable: true, width: "90px" },
        { key: "quality", sortable: true, width: "70px" },
        { key: "like", sortable: true, width: "70px" },
        { key: "download", sortable: true, width: "100px" },
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
        user: {},
      };
    },
  
    computed: {
      pages() {
        return this.perPage && this.perPage !== 0
          ? Math.ceil(this.filtered.length / this.perPage)
          : this.filtered.length;
      },
      types() {
        const typesWithNumbers = this.$store.getters.userProducts.map(
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
      editRow(row) {
        this.$store
          .dispatch("getByIdProduct", row.id)
          .then((res) => {
            res.status = !res.status
            this.$store.dispatch("editProduct", res)
            this.$store.dispatch("getUserWithProduct", this.$route.params.id || '');
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
      getUser(){
        try {
          this.$store.dispatch("getByIdUser", this.$route.params.id || '').then(res => {
            this.user = res
          }).catch(err => console.log(err))
        } catch (error) {
          console.log(error)
        }
      }
    },
    mounted() {
      this.$store.dispatch("getProducts")
      this.$store.dispatch("getUserWithProduct", this.$route.params.id || '');
      this.getUser()
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
  </style>