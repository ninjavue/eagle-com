

const category = {
    state: {
        categories: [],
        category: {}
    },
    getters: {
        categories(state) {
            return state.categories
        },
        category(state) {
            return state.category
        }
    },
    mutations: {
        categories(state, payload) {
            state.categories = payload
        },
        category(state, payload) {
            state.category = payload
        },
        addCategory(state, payload) {
            return state.categories.push(payload)
        },
        deleteCategory(state, payload) {
            let index = state.categories.findIndex(category => category.id == payload.id)
            state.categories.splice(index, 1)
        },
        saveCategory(state, payload) {
            state.categories = state.categories.map(category => {
                if (category.id == payload.id) {
                    return payload
                }
                return category
            })
        }
    },
    actions: {
        getCategories(context) {
            try {
                context.dispatch('getData', 'categories').then(res => {
                    context.commit('categories', res)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getByIdCategory(context, payload) {
            try {
                return context.dispatch('getDataById', {
                    url: 'categories',
                    id: payload
                })
            } catch (error) {
                console.log(error)
            }
        },
        postCategory(context, payload) {
            try {
                context.dispatch('postData', {
                    url: 'categories',
                    data: payload
                }).then(res => {
                    context.commit('addCategory', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        editCategory(context, payload) {
            try {
                context.dispatch('updateData', {
                    url: 'categories',
                    data: payload
                }).then(res => {
                    context.commit('saveCategory', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        deleteCategory(context, payload) {
            try {
                context.dispatch('deleteData', {
                    url: 'categories',
                    id: payload
                }).then(res => {
                    context.commit('deleteCategory', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
    }
}


export default category