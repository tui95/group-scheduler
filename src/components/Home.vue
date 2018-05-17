<template>
    <v-container fluid fill-height>
        <v-layout row wrap fluid>
            <v-flex xs3>
                <Sidebar />
            </v-flex>
            <v-flex xs8>
                <v-flex xs12 class="text-xs-center" mt-5>
                    <h1>Home page</h1>
                </v-flex>
                <v-flex xs12 sm8 offset-sm2>
                    <v-card>
                        <v-card-media src="/static/home_image.jpg" height="300px">
                        </v-card-media>
                        <v-card-actions>
                            <v-btn dark color="green" to="/enroll">Enroll</v-btn>
                            <v-btn dark color="blue" to="/create">Create</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Sidebar from '@/components/Sidebar'
    export default {
        components : {
            Sidebar
        }
    }
</script>
