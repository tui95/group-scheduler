<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h3 class="headline">Change Password</h3>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <form @submit.prevent="changePassword">
                            <v-flex>
                                <v-alert type="error" dismissible v-model="alert">
                                    {{error}}
                                </v-alert>
                            </v-flex>
                            <v-layout column>
                                <v-flex>
                                    <v-text-field
                                        name="old_password"
                                        label="Current Password"
                                        id="old_password"
                                        type="password"
                                        v-model = "old_password"
                                        prepend-icon="vpn-key"
                                        required
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-text-field
                                        name="new_password"
                                        label="New Password"
                                        id="new_password"
                                        type="password"
                                        v-model = "new_password"
                                        prepend-icon="lock"
                                        required
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-text-field
                                        name="confirmpassword"
                                        label="Confirm Password"
                                        id="confirmpassword"
                                        type="password"
                                        v-model = "confirmpassword"
                                        prepend-icon="check_circle"
                                        :rules = "[comparePasswords]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex class="text-xs-center my-3">
                                    <v-btn color="primary" type="submit" style="float : right" :disabled="loading">Submit</v-btn>
                                    <v-btn color="secondary" style="float : right" @click="() => $router.push('/profile')" :disabled="loading">Back</v-btn>
                                </v-flex>
                            </v-layout>
                        </form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import firebase from '@/firebase'
export default {
    data() {
        return {
            old_password : '',
            new_password : '',
            confirmpassword : '',
            alert : false
        }
    },
    computed : {
        comparePasswords(){
            return this.new_password === this.confirmpassword ? true : 'Passwords don\'t match'
        },
        error() {
            return this.$store.state.error
        },
        loading() {
            return this.$store.state.loading
        }
    },
    methods : {
        changePassword() {
            this.$store.dispatch("reauthenticateUser",{email : firebase.auth().currentUser.email, password: this.old_password})
            this.old_password = ''
            this.$store.dispatch("changePassword",{new_password : this.new_password})
        }
    },
    watch: {
        error(value) {
            if(value) {
                this.alert = true
            }
        },
        alert(value) {
            if(!value){
                this.$store.commit('setError',null)
            }
        }
    }
}
</script>
