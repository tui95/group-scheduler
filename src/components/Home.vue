<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Home page</h1>
            </v-flex>
            <v-flex xs12 class="text-xs-center" mt-3>
                <p>This is a user's home page.</p>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-media src="/static/material.jpg" height="200px">
                    </v-card-media>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn flat color="orange">Share</v-btn>
                        <v-btn flat color="orange">Explore</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {}
</script>
