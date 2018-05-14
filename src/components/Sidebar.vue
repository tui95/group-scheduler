<template>
    <v-navigation-drawer permanent>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Application
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0">
      <v-list-tile v-for="(item,index) in userGroups" :key="index" @click="''"> 
        
        <v-list-tile-content >
          <v-list-tile-title >
              {{item.groupData.groupName}}
          </v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>
    </v-list>   

  </v-navigation-drawer>
</template>

<script>
    export default {
        data() {
            return {
            }
        
        },
        computed: {
            userGroups(){
                return this.$store.getters.getUserGroups;
            },
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
        },
        
    }
</script>
