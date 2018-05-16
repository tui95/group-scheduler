<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="text-xs-center elevation-12">
                    <v-card-media src="static/calendar2.jpg" height="100px">
                    </v-card-media>
                    <v-flex mt-3>
                        <h1>Forgot Password?</h1>
                    </v-flex>
                    <v-card-text>
                        <form @submit.prevent="requestResetForm">
                            <v-layout column>
                                <v-flex>
                                    <v-alert type="error" dismissible v-model="alert">
                                        {{error}}
                                    </v-alert>
                                </v-flex>
                                <v-flex>
                                    <v-text-field
                                        name="email"
                                        label = "Your email associated with the account"
                                        id = "email"
                                        type = "email"
                                        v-model = "email"
                                        prepend-icon= "email"
                                        required
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex class = "text-xs-center mb-3">
                                    <v-btn color = "primary" style="float : right" type="submit" :disabled="loading"> Submit </v-btn>
                                    <v-btn color="secondary" style="float : right" @click="() => $router.push('/signin')" :disabled="loading">Back</v-btn>
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
  data(){
      return{
          email : '',
          alert : false
      }
  },
  computed:{
      error() {
          return this.$store.state.error
      },
      loading() {
          return this.$store.state.loading
      }
  },
  methods: {
      requestResetForm() {
          this.$store.dispatch('sendResetEmail',{email: this.email})
      }
  },
  watch: {
      error(value) {
          if (value){
              this.alert = true
          }
      },
      alert(value) {
          if (!value) {
              this.$store.commit('setError',null)
          }
      }
  }
}
</script>
