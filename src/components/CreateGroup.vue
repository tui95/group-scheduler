<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 class="text-xs-center" mt-5>
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
                        <v-text-field
                            name="group_description"
                            label="Group Description"
                            v-model="group_description"
                            multi-line
                        ></v-text-field>
                        <v-flex class="text-xs-center" mt-5>
                            <v-btn color="primary" type="submit">Create</v-btn>
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
                group_name: '',
                group_description:'',
                alert: false
            }
        },
        methods: {
            userCreateGroup() {
                this.$store.dispatch('userCreateGroup', {group_name : this.group_name, group_description:this.group_description})
                this.group_name =''
                this.group_description=''
                alert("You successfully create the group")
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
