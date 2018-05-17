<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm8 offset-sm2>
                <v-card height="200%">
                    <v-card-text>
                        <div class="text-xs-center mt-4 headline">Profile</div>
                    </v-card-text>
                    <v-container>
                        <v-flex xs12 sm8 offset-sm2>
                            <form v-for="field in fields">
                                <v-layout column v-if="field.editing">
                                    <v-flex>
                                        <v-alert type="error" dismissible v-model="alert">
                                            {{ error }}
                                        </v-alert>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field
                                            v-model="field.value"
                                            :type="field.type"
                                            :label="field.label"
                                        />
                                    </v-flex>
                                    <v-flex mb-4>
                                        <!--<v-text-field-->
                                            <!--v-model="currentPassword"-->
                                            <!--type="password"-->
                                            <!--label="Current Password"-->
                                        <!--/>-->
                                        <v-btn top small @click="cancelEdit(field)">
                                            Cancel
                                        </v-btn>
                                        <v-btn top small @click="updateProfile(field)" color="orange" dark>
                                            Save change
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout row v-else>
                                    <p class="subheading"> {{field.label}}: {{ field.value }} </p>
                                    <v-spacer></v-spacer>
                                    <v-btn v-if="isNotEmail(field)" icon bottom @click="field.editing = true">
                                        <v-icon class="small-icon">edit</v-icon>
                                    </v-btn>
                                </v-layout>
                            </form>
                        </v-flex>
                    </v-container>
                    <v-container>
                        <v-layout>
                            <v-flex xs12 sm8 offset-sm2>
                                <v-btn right small color="red" dark>Change password</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                fields: [],
                currentPassword: '',
                alert: false
            }
        },
        computed: {
            user() {
                return this.$store.getters.getUser
            },
            error() {
                return this.$store.state.error
            }
        },
        methods: {
            setFields() {
                this.fields.push(
                    {
                        value: this.user.displayName,
                        type: 'text',
                        label: 'Name',
                        editing: false,
                    },
                    {
                        value: this.user.email,
                        type: 'email',
                        label: 'Email',
                        editing: false,
                    }
                )
            },
            cancelEdit(field) {
                if (field.label === 'Name') {
                    field.value = this.user.displayName
                }
                else if (field.label === 'Email') {
                    field.value = this.user.email
                }
                field.editing = false
            },
            updateProfile(field) {
                // this.$store.dispatch("reauthenticateUser", {email: this.user.email, password: this.currentPassword})
                // this.currentPassword = ''
                if (field.label === 'Name') {
                    this.$store.dispatch('updateDisplayName', {
                        displayName: field.value,
                        // password: this.currentPassword,
                        // email: this.user.email
                    })
                    field.editing = false
                }
                // else if (field.label === 'Email') {
                //     this.$store.dispatch('updateEmail', {email: field.value})
                //     field.editing = false
                // }
            },
            isNotEmail(field) {
                return field.label !== 'Email'
            }
        },
        created() {
            this.setFields()
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
    };
</script>


<style scoped>
    .small-icon {
        font-size: 15px;
    }
</style>
