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
                            <form @submit.prevent="" v-for="field in fields">
                                <v-layout column v-if="field.editing">
                                    <v-flex>
                                        <v-text-field
                                            v-model="field.value"
                                            :type="field.type"
                                            :label="field.label"
                                        />
                                    </v-flex>
                                    <v-flex mb-4>
                                        <v-btn top small @click="field.editing = !field.editing">
                                            Cancel
                                        </v-btn>
                                        <v-btn top small type="submit" color="orange" dark>
                                            Save change
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout row v-else>
                                    <p class="subheading"> {{field.label}}: {{ field.value }} </p>
                                    <v-spacer></v-spacer>
                                    <v-btn icon bottom @click="field.editing = !field.editing">
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
                name: 'test',
                email: 'example',
                editMode: {
                    editingName: false,
                    editingEmail: false
                },
                fields: [
                    {
                        value: 'test',
                        type: 'text',
                        label: 'Name',
                        editing: false
                    },
                    {
                        value: 'example',
                        type: 'email',
                        label: 'Email',
                        editing: false
                    }
                ]
            }
        }
    };
</script>


<style scoped>
    .small-icon {
        font-size: 15px;
    }
</style>
