

const product = {
    state: {
        products: [],
        userProducts: [],
        product: {}
    },
    getters: {
        products(state) {
            return state.products
        },
        userProducts(state) {
            return state.userProducts
        },
        product(state) {
            return state.product
        }
    },
    mutations: {
        products(state, payload) {
            state.products = payload
        },
        userProducts(state, payload) {
            state.userProducts = payload
        },
        product(state, payload) {
            state.product = payload
        },
        addProduct(state, payload) {
            return state.products.push(payload)
        },
        deleteProduct(state, payload) {
            let index = state.products.findIndex(product => product.id == payload.id)
            state.products.splice(index, 1)
        },
        saveProduct(state, payload) {
            state.products = state.products.map(product => {
                if (product.id == payload.id) {
                    return payload
                }
                return product
            })
        }
    },
    actions: {
        getUserWithProduct(context,payload){
            try {
                context.dispatch('getData', 'products').then(res => {
                    res = res.filter(product => payload.includes(product.userId))
                    context.commit('userProducts', res)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getCategoryWithProduct(context,payload){
            try {
                context.dispatch('getData', 'products').then(res => {
                    res = res.filter(product => payload.includes(product.categoryId))
                    context.commit('products', res)
                })
            } catch (error) {
                console.log(error)
            }
        },
        async getProducts(context) {
            try {
                await context.dispatch('getData', 'products').then(res => {
                    context.commit('products', res)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getByIdProduct(context, payload) {
            try {
                return context.dispatch('getDataById', {
                    url: 'products',
                    id: payload
                })
            } catch (error) {
                console.log(error)
            }
        },
        postProduct(context, payload) {
            try {
                context.dispatch('postData', {
                    url: 'products',
                    data: payload
                }).then(res => {
                    context.commit('addProduct', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        editProduct(context, payload) {
            try {
                context.dispatch('updateData', {
                    url: 'products',
                    data: payload
                }).then(res => {
                    context.commit('saveProduct', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        deleteProduct(context, payload) {
            try {
                context.dispatch('deleteData', {
                    url: 'products',
                    id: payload
                }).then(res => {
                    context.commit('deleteProduct', res)
                })
            } catch (error) {
                alert(error.message)
            }
        }
    }
}


export default product