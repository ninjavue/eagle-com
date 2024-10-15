<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <div class="row">
      <div class="col-6" style="margin-bottom:20px" v-for="item,i of dashboard" :key="i">
        <router-link :to="`${item.link}`">
          <VaCard class="dashboard-card">
            <div class="dashboard-card-title">{{item.title}}</div>
            <div class="dashboard-card-cnt">{{item.cnt}}</div>
          </VaCard>
      </router-link>
      </div>
      <div class="col-6" style="margin-bottom:20px">
          <VaCard class="dashboard-card">
            <div class="dashboard-card-title">Yangi rasmlar</div>
            <div class="dashboard-card-cnt">{{types?.length}}</div>
          </VaCard>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed:{
    dashboard(){
      return [
        {
          title: 'Kategoriyalar',
          cnt: this.$store.getters.categories.length,
          link:'/admin/categories'
        },
        {
          title: 'Rasmlar',
          cnt: this.$store.getters.products.length,
          link:'/admin/product'
        },
        {
          title: 'Foydalanuvchilar',
          cnt: this.$store.getters.users.length,
          link:'/admin/allusers'
        },
      ]
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
  mounted(){
    this.$store.dispatch("getCategories")
    this.$store.dispatch("getProducts")
    this.$store.dispatch("getUsers")
  }
}
</script>

<style lang="scss">
.dashboard{
  & h2{
    margin-bottom: 40px;
  }
  &-card{
    width: 95%;
    padding: 10px;
    display: flex;
    justify-content:center;
    align-items: center;
    flex-direction: column;
    &-title{
      font-size: 24px;
      font-weight: bold;
      color: blue;
      margin-bottom: 20px;
    }
    &-cnt{
      font-size: 32px;
      font-weight: bold;
      color: darkblue;
    }
  }
}
</style>