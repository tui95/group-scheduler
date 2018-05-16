<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="text-xs-center elevation-12">
                    <v-card-media src = "static/calendar2.jpg" height="100px">
                    </v-card-media>
                    <v-flex mt-3>
                        <h1> Sign In </h1>
                    </v-flex>
                    <v-card-text>
                        <form @submit.prevent="userSignIn">
                            <v-layout column>
                                <v-flex my-3>
                                    <v-alert type="error" dismissible v-model="alert">
                                        {{error}}
                                    </v-alert>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                        name = "email"
                                        label = "Email"
                                        id = "email"
                                        type = "email"
                                        v-model = "email"
                                        prepend-icon = "person"
                                        required
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                        name = "password"
                                        label = "Password"
                                        id = "password"
                                        type = "password"
                                        v-model = "password"
                                        prepend-icon = "lock"
                                        required
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex class="text-xs-center mb-3">
                                    <v-btn color="primary" type="submit">Sign In</v-btn>
                                    <router-link to="/forgotpassword"> Forgot Password? </router-link>
                                </v-flex>
                                <v-flex>
                                    Don't have an account yet? <router-link to="/signup">Signup here</router-link>
                                </v-flex>
                                <v-divider class="my-3"></v-divider> 
                                <v-btn block color="primary" @click="userSignInWithGoogle" >
                                        <v-icon left>mail</v-icon>
                                        Sign-in with Google
                                </v-btn>
                            </v-layout>
                        </form>       
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
                alert: false
            }
        },
        methods: {
            userSignIn() {
                this.$store.dispatch('userSignIn', {email: this.email, password: this.password})
            },
            userSignInWithGoogle() {
                this.$store.dispatch('signinWithGoogle',{})
            }
        },
        computed: {
            error() {
                return this.$store.state.error
            },
            loading() {
                return this.$store.state.loading
            }
        },
        watch: {
            error(value) {
                if (value) {
                    this.alert = true
                }
            },
            alert(value) {
                if (!value) {
                    this.$store.commit('setError', null)
                }
            }
        }
    }
</script>
