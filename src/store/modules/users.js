

const user = {
    state: {
        users: [],
        user: {}
    },
    getters: {
        users(state) {
            return state.users
        },
        user(state) {
            return state.user
        }
    },
    mutations: {
        users(state, payload) {
            state.users = payload
        },
        user(state, payload) {
            state.user = payload
        },
        addUser(state, payload) {
            return state.users.push(payload)
        },
        deleteUser(state, payload) {
            let index = state.users.findIndex(user => user.id == payload.id)
            state.users.splice(index, 1)
        },
        saveUser(state, payload) {
            state.users = state.users.map(user => {
                if (user.id == payload.id) {
                    return payload
                }
                return user
            })
        }
    },
    actions: {
        getUsers(context) {
            try {
                context.dispatch('getData', 'users').then(res => {
                    context.commit('users', res)
                })
            } catch (error) {
                console.log(error)
            }
        },
        checkUser(context) {
            try {
                return context.dispatch('getData', 'users')
            } catch (error) {
                console.log(error)
            }
        },
        getByIdUser(context, payload) {
            try {
                return context.dispatch('getDataById', {
                    url: 'users',
                    id: payload
                })
            } catch (error) {
                console.log(error)
            }
        },
        postUser(context, payload) {
            try {
                return context.dispatch('postData', {
                    url: 'users',
                    data: payload
                })
            } catch (error) {
                alert(error.message)
            }
        },
        editUser(context, payload) {
            try {
                context.dispatch('updateData', {
                    url: 'users',
                    data: payload
                }).then(res => {
                    context.commit('saveUser', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        deleteUser(context, payload) {
            try {
                context.dispatch('deleteData', {
                    url: 'users',
                    id: payload
                }).then(res => {
                    context.commit('deleteUser', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
    }
}


export default user