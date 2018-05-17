<template>
    <v-navigation-drawer permanent>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Your Groups
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0">
      <v-list-tile v-for="(item,index) in userGroups" :key="index" @click="goToGroup(item.groupId)">

        {{item.groupName}}


        <!-- <div>
        </div>
        <v-list-tile-avatar>
            {{index}}.
        </v-list-tile-avatar>
        <v-list-tile-content >
          <v-list-tile-title >
              {{item.groupData.groupName}}
          </v-list-tile-title>
        </v-list-tile-content> -->

      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
    import firebase from '@/firebase'
    export default {
        data() {
            return {
                // userGroupKeys : null,
                userGroups : [],
            }
        },
        created(){
            // const uid = firebase.auth().currentUser.uid;
            // const userRef = firebase.database().ref('users/'+uid+'/groups');
            // let user_groups = [];
            // userRef.once('value', function(snapshot) {
            //     snapshot.forEach(function(childSnapshot) {
            //         const childData = childSnapshot.val();
            //         user_groups = user_groups.concat([childData])
            //         });
            //     }
            // ).then(
            //     () =>{
            //         for (let i=0; i<user_groups.length; i++){
            //             this.userGroups.push({
            //                 groupData: this.getGroupData(user_groups[i]),
            //                 code: user_groups[i]
            //             });
            //         }
            //     }
            // ).catch(error=> {console.log(error)})
            this.userGroups = this.$store.state.userGroupsInfo
        },
        methods :{
            // getGroupData(groupKey){
            //     let groupData = {};
            //     const groupRef = firebase.database().ref('groups/'+groupKey);
            //     groupRef.once('value', snapshot => {
            //         groupData = snapshot.val()
            //     })
            //     return groupData;
            // },
            goToGroup(id) {
                this.$router.push('/groups/' + id)
            }
        },
        computed: {
            error() {
                return this.$store.state.error
            },
            loading() {
                return this.$store.state.loading
            },
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
