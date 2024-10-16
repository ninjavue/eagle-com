<template>
  <div class="d-flex align-start justify-start mb-30">
    <VaInput
      v-model="filter"
      class="col-6"
      placeholder="Foydalanuvchi qidirish..."
    />
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
    <template #cell(full_name)="{ row }">
      <router-link class="admin-link" :to="`/admin/user/${row.rowData.id}`">{{
        row.rowData.full_name
      }}</router-link>
    </template>
    <template #cell(username)="{ row }">
      <router-link class="admin-link" :to="`/admin/user/${row.rowData.id}`">{{
        row.rowData.username
      }}</router-link>
    </template>
    <template #cell(img)="{ row }">
      <router-link :to="`/admin/user/${row.rowData.id}`">
        <div class="user-img" style="border-radius: 50%; overflow: hidden">
          <img :src="`${row.rowData.img}`" alt="img" />
        </div>
      </router-link>
    </template>
    <template #cell(status)="{ row }">
      <div class="table-btn">
        <VaButton
          class="ml-3"
          size="small"
          :color="row.rowData.status == 'active' ? 'info' : 'danger'"
          style="text-transform: capitalize"
          @click="editRow(row.rowData)"
        >
          {{ row.rowData.status }}
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
</template>
      
    <script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    const users = [];
    const columns = [
      { key: "N", sortable: true, width: "30px" },
      { key: "img", sortable: true, width: "80px" },
      { key: "full_name", sortable: true, width: "200px" },
      { key: "login", sortable: true, width: "150px" },
      { key: "status", width: "100px" },
      { key: "like", sortable: true, width: "100px" },
      { key: "download", sortable: true, width: "150px" },
      { key: "date", sortable: true, width: "140px" },
    ];

    return {
      text: "",
      items: users,
      columns,
      perPage: 6,
      currentPage: 1,
      filter: "",
      filtered: users,
      showModal: false,
      login: {
        username: "",
        password: "",
        createdAt: "",
      },
      isError: false,
      isUpdated: false,
      id: "",
      isShow: "",
    };
  },

  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
        ? Math.ceil(this.filtered.length / this.perPage)
        : this.filtered.length;
    },
    types() {
      const typesWithNumbers = this.$store.getters.users.map((type, index) => {
        return {
          ...type,
          like: type.likes.length,
          download: type.downloads.length,
          N: index + 1,
          date: this.formatDate(type.created_at),
        };
      });

      return typesWithNumbers;
    },
  },
  methods: {
    formatDate(proxyDate) {
      try {
        const months = [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const { nanoseconds, seconds } = proxyDate;
        const milliseconds = seconds * 1000 + nanoseconds / 1e6;
        const date = new Date(milliseconds);

        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString();
        const year = date.getUTCFullYear();
        return `${day}th ${months[month - 1]} ${year}`;
      } catch (error) {
        console.log(error);
      }
    },
    handlePassword(id) {
      if (this.isShow === id) {
        this.isShow = "";
      } else {
        this.isShow = id;
      }
    },
    editRow(row) {
      this.$store
        .dispatch("getByIdUser", row.id)
        .then((res) => {
          const user = res;
          if (user.status == "active") {
            user.status = "block";
          } else {
            user.status = "active";
          }
          this.$store.dispatch("editUser", user);
          this.id = res.id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.$store.dispatch("getUsers");
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
.user-img {
  width: 40px;
  height: 40px;
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