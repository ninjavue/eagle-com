

const admin = {
    state: {
        admins: [],
        admin: {}
    },
    getters: {
        admins(state) {
            return state.admins
        },
        admin(state) {
            return state.admin
        }
    },
    mutations: {
        admins(state, payload) {
            state.admins = payload
        },
        admin(state, payload) {
            state.admin = payload
        },
        addAdmin(state, payload) {
            return state.admins.push(payload)
        },
        deleteAdmin(state, payload) {
            let index = state.admins.findIndex(admin => admin.id == payload.id)
            state.admins.splice(index, 1)
        },
        saveAdmin(state, payload) {
            state.admins = state.admins.map(admin => {
                if (admin.id == payload.id) {
                    return payload
                }
                return admin
            })
        }
    },
    actions: {
        getAdmins(context) {
            try {
                context.dispatch('getData', 'admins').then(res => {
                    context.commit('admins', res)
                })
            } catch (error) {
                console.log(error)
            }
        },
        checkAdmin(context) {
            try {
                return context.dispatch('getData', 'admins')
            } catch (error) {
                console.log(error)
            }
        },
        getByIdAdmin(context, payload) {
            try {
                return context.dispatch('getDataById', {
                    url: 'admins',
                    id: payload
                })
            } catch (error) {
                console.log(error)
            }
        },
        postAdmin(context, payload) {
            try {
                context.dispatch('postData', {
                    url: 'admins',
                    data: payload
                }).then(res => {
                    context.commit('addAdmin', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        editAdmin(context, payload) {
            try {
                context.dispatch('updateData', {
                    url: 'admins',
                    data: payload
                }).then(res => {
                    context.commit('saveAdmin', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
        deleteAdmin(context, payload) {
            try {
                context.dispatch('deleteData', {
                    url: 'admins',
                    id: payload
                }).then(res => {
                    context.commit('deleteAdmin', res)
                })
            } catch (error) {
                alert(error.message)
            }
        },
    }
}


export default admin