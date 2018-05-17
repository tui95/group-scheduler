import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        appTitle: 'My Awesome App',
        user: null,
        error: null,
        loading: false
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        userSignUp({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    const newUser = {
                        id: firebaseUser.user.uid,
                        displayName: firebaseUser.user.displayName,
                        email: firebaseUser.user.email
                    }
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    router.push('/home')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        userSignIn({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    const newUser = {
                        id: firebaseUser.user.uid,
                        displayName: firebaseUser.user.displayName,
                        email: firebaseUser.user.email
                    }
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    commit('setError', null)
                    router.push('/home')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        autoSignIn({commit}, payload) {
            const newUser = {
                id: payload.uid,
                displayName: payload.displayName,
                email: payload.email
            }
            commit('setUser', newUser)
        },
        userSignOut({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
            router.push('/')
        },
        updateDisplayName({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updateProfile({displayName: payload.displayName})
                .then(f => {
                    commit('setLoading', false)
                })
        },
        updateEmail({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updateEmail(payload.email)
                .then(f => {
                    commit('setLoading', false)
                })
        },
        reauthenticateUser({commit}, payload) {
            commit('setLoading', true)
            const credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
            firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
                .then(f => {
                    commit('setLoading', false)
                    commit('setError', null)
                })
                .catch(error => {
                    console.log(error)
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        changePassword({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updatePassword(payload.new_password).then(function(){
                commit('setLoading',false)
                router.push('/profile')
            }).catch(function(error){
                commit('setError', error.message)
                commit('setLoading', false)
            })
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        getUser(state) {
            return state.user
        },
        getError(state) {
            return state.error
        }
    }
})
