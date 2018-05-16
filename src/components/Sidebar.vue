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
        fuck 
      <v-list-tile v-for="(item,index) in userGroups" :key="index" @click="''">
        {{item}}
        
        
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

            const uid = firebase.auth().currentUser.uid;
            const userRef = firebase.database().ref('users/'+uid+'/groups');
            var user_groups = [];
            console.log('shit')
            userRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    user_groups = user_groups.concat([childData])
                    });
                }
            ).then(
                () =>{
                    this.userGroupKeys = user_groups;
                    var groups = []
                    for (var i=0;i<this.userGroupKeys.length;i++){
                        this.userGroups.push(this.getGroupData(this.userGroupKeys[i]));
                    }
                    
                    console.log(this.userGroups)

                }
            ).catch(error=> {console.log(error)})
            
        },
        methods :{
            getGroupData(groupKey){
                var groupData={}
                const groupRef = firebase.database().ref('groups/'+groupKey);
                groupRef.once('value', function(snapshot){
                    snapshot.forEach(function(childSnapshot){
                        var childKey = childSnapshot.key
                        var childData = childSnapshot.val();
                        groupData[childKey] = childData
                        
                    })
                })
                console.log(groupData);
                return groupData;

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
        },
        
    }
</script>
