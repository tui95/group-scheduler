<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h3 class="headline text-xs-left"> Create Group </h3>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="text-xs-left">
                        <div>Fill in the form below then submit to create a new group</div>
                        <form @submit.prevent="userCreateGroup">
                            <v-layout column>
                                <v-flex>
                                    <v-alert type="error" dismissible v-model="alert">
                                        {{ error }}
                                    </v-alert>
                                </v-flex>

                                <v-flex>
                                    <v-text-field
                                        name="group_name"
                                        label="Group Name"
                                        id="group_name"
                                        type="text"
                                        v-model="group_name"
                                        prepend-icon="group"
                                        required>
                                    </v-text-field>
                                </v-flex>
                                <v-divider></v-divider>
                                <v-flex class="text-xs-right" mt-2>
                                    <v-btn color="primary" type="submit">Create</v-btn>
                                    <v-btn color="secondary" @click="() => $router.push('/')" :disabled="loading">Back</v-btn>
                                </v-flex>
                            </v-layout>
                        </form>
                    </v-card-text>
                </v-card>
            </v-flex>
            <!-- <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Create Group</h1>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 mt-3>
                <form @submit.prevent="userCreateGroup">
                    <v-layout column>
                        <v-flex>
                            <v-alert type="error" dismissible v-model="alert">
                                {{ error }}
                            </v-alert>
                        </v-flex>

                        <v-flex>
                            <v-text-field
                                name="group_name"
                                label="Group Name"
                                id="group_name"
                                type="text"
                                v-model="group_name"
                                required>
                            </v-text-field>
                        </v-flex>
                        <v-flex class="text-xs-center" mt-5>
                            <v-btn color="primary" type="submit">Create</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex> -->
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                group_name: '',
                alert: false
            }
        },
        methods: {
            userCreateGroup() {
                this.$store.dispatch('userCreateGroup', {group_name : this.group_name})
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
