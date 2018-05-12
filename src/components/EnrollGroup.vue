<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Enroll</h1>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 mt-3>
                <form @submit.prevent="userEnrollGroup">
                    <v-layout column>
                        <v-flex>
                            <v-alert type="error" dismissible v-model="alert">
                                {{ error }}
                            </v-alert>
                        </v-flex>

                        <v-flex>
                            <v-text-field
                                name="enroll_group_key"
                                label="Group Code"
                                id="enroll_group_key"
                                type="text"
                                v-model="enroll_group_key"
                                required>
                            </v-text-field>
                        </v-flex>
                        <v-flex class="text-xs-center" mt-5>
                            <v-btn color="primary" type="submit">Enroll</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
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
