<template>
  <div class="header">
     <div class="container">
        <nav>
            <div class="d-center gap-30">
                <router-link to="/" class="nav-logo">
                <img src="../../assets/logo.png" alt=""> 
                <h3>Eagle.com</h3>
            </router-link>
            <router-link to="/categories" class="categories">
                <i class="fa-solid fa-layer-group"></i>
                <p>{{$t('categories')}}</p>
            </router-link>
            </div>
            <div class="nav-search">
                <input v-model="searchQuery" @keyup.enter="performSearch" type="text"  :placeholder="$t('search')">
                <button @click="performSearch"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div class="nav-right">
                <div class="dropdown">
                <button class="dropbtn"> <i class="fa-solid fa-chevron-down"></i>
                        <img v-if="$i18n.locale == 'En'" src="@/assets/img/usa.png" alt="">
                        <img v-else-if="$i18n.locale == 'Uz'" src="@/assets/img/uzb.png" alt="">
                        <img v-else-if="$i18n.locale == 'Ru'" src="@/assets/img/russia.png" alt="">
                    {{ $i18n.locale }}</button>
                    <div class="dropdown-content">
                        <div
                            v-for="locale in $i18n.availableLocales"
                            :key="`locale-${locale}`"
                            @click="handleLanguage(locale)"
                            :value="locale"
                            class="drop-text"
                            >
                            <img v-if="locale == 'En'" src="@/assets/img/usa.png" alt="">
                            <img v-else-if="locale == 'Uz'" src="@/assets/img/uzb.png" alt="">
                            <img v-else-if="locale == 'Ru'" src="@/assets/img/russia.png" alt="">
                            {{ locale }}
                            </div>
                    </div>
                </div>
              
                <router-link to="/auth">
                    <i class="fa-solid fa-user"></i>
                </router-link>
                <button @click="darkMode">
                    <input id="toggle" class="toggle" type="checkbox">
                </button>
            </div>
        </nav>
     </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            searchQuery:""
        }
    },
    methods:{
        darkMode(){
            document.documentElement.classList.toggle('dark-mode');
            if (document.documentElement.classList.contains('dark-mode')) {
                console.log('dark')
            } else {
                console.log('light')
            }
        },
        handleLanguage(locale) {
            this.$i18n.locale = locale;
            localStorage.setItem('language', locale)
        },
        changeLanguage(lang) {
            this.$i18n.locale = lang;
        },
        performSearch() {
            if (this.searchQuery) {
                const url = `/search?query=${encodeURIComponent(this.searchQuery)}`;
                this.$router.push(url)
            }
        }
    },
    mounted() {
        this.searchQuery = this.$route.query.query || ''
        const language = localStorage.getItem('language')
        if(language){
            this.changeLanguage(language);
        }
    },
    watch: {
        '$route.query.query'(newQuery) {
            this.searchText = newQuery || ''
        }
    }
}
</script>

<style lang="scss">
@import "../../styles/layouts/header.scss";
</style>