<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="text-xs-center elevation-12">
                    <v-card-media src = "static/calendar2.jpg" height = "100px">
                    </v-card-media>
                    <v-flex mt-3>
                        <h1> Sign up </h1>
                    </v-flex>
                    <v-card-text>
                        <form @submit.prevent="userSignUp">
                            <v-layout column>
                                <v-flex my-3>
                                    <v-alert type="error" dismissible v-model="alert">
                                        {{error}}
                                    </v-alert>
                                </v-flex>
                                <v-flex>
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
                                <v-flex>
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
                                <v-flex xs12>
                                    <v-text-field
                                        name = "confirmPassword"
                                        label = "Confirm Password"
                                        id = "confirmPassword"
                                        type = "password"
                                        v-model = "passwordConfirm"
                                        prepend-icon = "check_circle"
                                        :rules = "[comparePasswords]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-divider class="my-3"></v-divider>
                                <v-flex class="text-xs-center my-3">
                                    <v-btn color="primary" type="submit" style="float : right" :disabled="loading">Sign Up</v-btn>
                                    <v-btn color="secondary" style="float : right" @click="() => $router.push('/signin')" :disabled="loading">Back</v-btn>
                                </v-flex>
                            </v-layout>
                        </form>
                    </v-card-text>
                </v-card>
                <!-- <form @submit.prevent="userSignUp">
                    <v-layout column>
                        <v-flex>
                            <v-alert type="error" dismissible v-model="alert">
                                {{ error }}
                            </v-alert>
                        </v-flex>
                        <v-flex>
                            <v-text-field
                                name="email"
                                label="Email"
                                id="email"
                                type="email"
                                v-model="email"
                                required>
                            </v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field
                                name="password"
                                label="Password"
                                id="password"
                                type="password"
                                v-model="password"
                                required>
                            </v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field
                                name="confirmPassword"
                                label="Confirm Password"
                                id="confirmPassword"
                                type="password"
                                required
                                v-model="passwordConfirm"
                                :rules="[comparePasswords]">
                            </v-text-field>
                        </v-flex>
                        <v-divider class="my-3"></v-divider>
                        <v-flex class="text-xs-center my-3">
                            <v-btn color="primary" type="submit" style="float : right" :disabled="loading">Sign Up</v-btn>
                            <v-btn color="secondary" style = "float :right">Back</v-btn>
                        </v-flex>
                    </v-layout>
                </form> -->
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
                passwordConfirm: '',
                alert: false
            }
        },
        computed: {
            comparePasswords() {
                return this.password === this.passwordConfirm ? true : 'Passwords don\'t match'
            },
            error() {
                return this.$store.state.error
            },
            loading() {
                return this.$store.state.loading
            }
        },
        methods: {
            userSignUp() {
                if (this.comparePasswords !== true) {
                    return
                }
                this.$store.dispatch('userSignUp', {email: this.email, password: this.password})
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
