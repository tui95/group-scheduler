<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 class="text-xs-justify" mt-5>
                <h1>Group title</h1>
                <v-divider></v-divider>
                
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex>
                <h3>Description: </h3>
                test test test test
                <v-divider></v-divider>
                <h4>Members:</h4>

            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex>
                <h2>Schedules: </h2>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name : "Groups",
        props : ['groupKey'],
        data() {
            return {

               
            }
        },
        methods: {
            
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

<style>

</style>
