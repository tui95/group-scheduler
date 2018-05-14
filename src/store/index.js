import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        appTitle: 'My Awesome App',
        user: null,
        error: null,
        loading: false
    },
    mutations: {
        setUser(state, payload) {
            var curUser = {
                email : payload.email,
                groups : []
            }


            const uid = firebase.auth().currentUser.uid;
            const userRef = firebase.database().ref('users/'+uid+'/groups');
            var user_groups = [];
            userRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    
                    console.log('child',childData)
                    var curGroupData = {}
                    const groupRef = firebase.database().ref('groups/'+childData);
                    groupRef.once('value', function(snapshot){
                        snapshot.forEach(function(child2Snapshot){
                            var child2Key = child2Snapshot.key
                            var child2Data = child2Snapshot.val();
                            curGroupData[child2Key] = child2Data
                        })
                    })
                    var group ={}
                    group['groupKey'] = childData
                    group['groupData'] = curGroupData;
                    user_groups = user_groups.concat([group])
                
                });
                }
            ).then(
                () =>{
                    curUser.groups = user_groups;
                    console.log(curUser.groups);
                }
            ).catch(error=> {console.log(error)})

            state.user = curUser;
        },
        setGroups(state, payload){

        }
        ,
        setError(state, payload) {
            state.error = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        userSignUp({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    commit('setUser', {email: firebaseUser.email})
                    commit('setLoading', false)
                    //
                    // const uid =firebaseUser.uid;
                    // firebase.database().ref('users/'+uid +'/groups').push();
                    //
                    router.push('/home')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        userSignIn({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    commit('setUser', payload)
                    commit('setGroups', null)  //no payload
                    commit('setLoading', false)
                    commit('setError', null)
                    router.push('/home')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        autoSignIn({commit}, payload) {
            commit('setUser', {email: payload.email})
        },
        userSignOut({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
            router.push('/')
        },
        userEnrollGroup({commit}, payload){
            commit('setLoading',true)
            const groupKey =payload.enroll_group_key;
            const groupMembersRef = firebase.database().ref('groups/'+groupKey+'/groupMembers');
            const uid = firebase.auth().currentUser.uid;
            const userRef = firebase.database().ref('users/'+uid+'/groups');
            const email = firebase.auth().currentUser.email;
            
            var user_groups = [];
            var group_members =[];

           
            firebase.database().ref('groups/').once('value', function(snapshot) {
                if (snapshot.hasChild(groupKey)) {
                    
                    userRef.once('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var childData = childSnapshot.val();
                            user_groups = user_groups.concat([childData]);
                        });
                        }
                    ).then(
                        () =>{
                            user_groups = user_groups.concat([groupKey]);
                            if(user_groups.length===1){
                                userRef.set([groupKey]);
                            }
                            else{
                                userRef.set(user_groups);   
                            }
                        }
                    )

                    //groups
                    groupMembersRef.once('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var childData = childSnapshot.val();
                            group_members = group_members.concat([childData]);
                        });
                    }
                    ).then(
                        () =>{
                            group_members = group_members.concat([email]);
                            console.log(group_members);
                            groupMembersRef.set(group_members);          
                        }
                    ).catch(error =>{
                        console.log(error)
                    });
                }
                else{
                    alert("Group Code does not exist")
                }
              });
        },
        userCreateGroup({commit}, payload){
            commit('setLoading',true)
            const email = firebase.auth().currentUser.email;
            const uid = firebase.auth().currentUser.uid;
            firebase.database().ref('groups/').push()
            .then(msg =>{
                const groupKey = msg.key;

                commit('setError',null)
                commit('setLoading',false)

                const groupRef = firebase.database().ref('groups/'+groupKey);   
                groupRef.child('groupName').set(payload.group_name); 
                groupRef.child('groupLeader').set(email)
                groupRef.child('groupMembers').set([email])
                groupRef.child('groupDescription').set(payload.group_description)
               var user_groups = [];
                firebase.database().ref('users/'+ uid +'/groups')
                .once('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                      var childData = childSnapshot.val();
                      user_groups = user_groups.concat([childData]);
                    });
                  }
                ).then(
                    () =>{

                        user_groups = user_groups.concat([groupKey]);
                        if(user_groups.length===1){
                            firebase.database().ref('users/'+ uid +'/groups').set([groupKey]);
                        }
                        else{
                            firebase.database().ref('users/'+ uid +'/groups').set(user_groups);   
                        }
                        
                    }
                )
                .catch(error =>{
                    console.log(error)
                });
                    
            })
            .catch(error =>{
                console.log('error',error)
                commit('setError',error.message);
                commit('setLoading',false)
            })
        
            
        }

    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        getAllGroups : state=>{
            console.log('groups',state.groups)
            return state.groups;
        },
        getUserGroups : state=>{
            console.log(state.user.groups)
            return state.user.groups;
        }
    }
})
