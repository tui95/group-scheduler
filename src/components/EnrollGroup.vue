<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="elevation-12">
                    <v-card-title>
                        <div><h3 class="headline text-xs-left mb-0"> Enroll </h3></div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="text-xs-left">
                        <div>insert the enroll code into the box below</div>
                        <form @submit.prevent="userEnrollGroup">
                            <v-layout column>
                                <v-flex>
                                    <v-alert type="error" dismissible v-model="alert">
                                        {{error}}
                                    </v-alert>
                                </v-flex>
                                <v-flex>
                                    <v-text-field
                                        name="enroll_group_key"
                                        label="Group Code"
                                        id="enroll_group_key"
                                        type="text"
                                        v-model="enroll_group_key"
                                        prepend-icon="vpn_key"
                                        required>
                                    </v-text-field>
                                </v-flex>
                                <v-divider></v-divider>
                                <v-flex class="text-xs-right" mt-2>
                                    <v-btn color="primary" type="submit">Enroll</v-btn>
                                    <v-btn color="secondary" @click="() => $router.push('/')" :disabled="loading">Back</v-btn>
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
    export default {
        data() {
            return {
                enroll_group_key: '',
                alert: false
            }
        },
        methods: {
            userEnrollGroup() {
                this.$store.dispatch('userEnrollGroup', {enroll_group_key : this.enroll_group_key})
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
