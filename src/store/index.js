import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'
import {googleProvider} from '@/firebase'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        appTitle: 'Grouppie',
        user: null,
        error: null,
        userGroupKeys: null,
        loading: false,
        currentGroupKey : '',
        userGroupsInfo: []
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        }
        ,
        setError(state, payload) {
            state.error = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setUserGroupsInfo(state, payload) {
            state.userGroupsInfo = payload.userGroupsInfo
        },
        setCurrentGroupKey(state, payload){
            state.currentGroupKey = payload
        }
    },
    actions: {
        sendResetEmail({commit},payload){
            commit('setLoading',true)
            firebase.auth().sendPasswordResetEmail(payload.email).then(result => {
                commit('setLoading',false)
                router.push('/signin')
            }).catch(error => {
                commit('setError', error.message)
                commit('setLoading',false)
            });
        },
        signinWithGoogle({commit},payload){
            commit('setLoading',true)
            firebase.auth().signInWithPopup(googleProvider).then(result => {
                commit('setUser', result.user)
                commit('setLoading',false)
                router.push('/')
                // // This gives you a Google Access Token. You can use it to access the Google API.
                // var token = result.credential.accessToken;
                // // The signed-in user info.
                // var user = result.user;
                // // ...
              }).catch(error => {
                commit('setError', error.message)
                commit('setLoading',false)
                // // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // // The email of the user's account used.
                // var email = error.email;
                // // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // // ...
              });
        },
        userSignUp({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    const newUser = {
                        id: firebaseUser.user.uid,
                        displayName: firebaseUser.user.displayName,
                        email: firebaseUser.user.email
                    }
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    //
                    // const uid =firebaseUser.uid;
                    // firebase.database().ref('users/'+uid +'/groups').push();
                    //
                    router.push('/')
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
                    const newUser = {
                        id: firebaseUser.user.uid,
                        displayName: firebaseUser.user.displayName,
                        email: firebaseUser.user.email
                    }
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    commit('setError', null)
                    router.push('/')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        autoSignIn({commit}, payload) {
            const newUser = {
                id: payload.uid,
                displayName: payload.displayName,
                email: payload.email
            }
            commit('setUser', newUser)
        },
        userSignOut({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
            router.push('/signin')
        },
        userEnrollGroup({commit}, payload) {
            commit('setLoading', true)
            const groupKey = payload.enroll_group_key;
            const groupMembersRef = firebase.database().ref('groups/' + groupKey + '/groupMembers');
            const uid = firebase.auth().currentUser.uid;
            const userRef = firebase.database().ref('users/' + uid + '/groups');
            const email = firebase.auth().currentUser.email;

            var user_groups = [];
            var group_members = [];

            firebase.database().ref('groups/').once('value', function (snapshot) {
                if (snapshot.hasChild(groupKey)) {

                    userRef.once('value', function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                var childData = childSnapshot.val();
                                user_groups = user_groups.concat([childData]);
                            });
                        }
                    ).then(
                        () => {
                            user_groups = user_groups.concat([groupKey]);

                            userRef.set(user_groups);

                        }
                    )

                    //groups
                    groupMembersRef.once('value', function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                var childData = childSnapshot.val();
                                group_members = group_members.concat([childData]);
                            });
                        }
                    ).then(
                        () => {
                            group_members = group_members.concat([email]);
                            console.log(group_members);
                            groupMembersRef.set(group_members);
                        }
                    ).catch(error => {
                        console.log(error)
                    });

                    alert("You successfully joined the group")
                }
                else {
                    alert("Group Code does not exist")
                }
            });
        },
        userCreateGroup({commit}, payload) {
            commit('setLoading', true)
            const email = firebase.auth().currentUser.email;
            const uid = firebase.auth().currentUser.uid;
            firebase.database().ref('groups/').push()
                .then(msg => {
                    const groupKey = msg.key;

                    commit('setError', null)
                    commit('setLoading', false)
                    commit('setCurrentGroupKey',groupKey)

                    const groupRef = firebase.database().ref('groups/' + groupKey);
                    groupRef.child('groupName').set(payload.group_name);
                    groupRef.child('groupLeader').set(email)
                    groupRef.child('groupMembers').set([email])
                    groupRef.child('groupDescription').set(payload.group_description)

                    groupRef.child('groupSchedule').child('0').set('empty')
                    groupRef.child('groupSchedule').child('1').set('empty')
                    groupRef.child('groupSchedule').child('2').set('empty')
                    groupRef.child('groupSchedule').child('3').set('empty')
                    groupRef.child('groupSchedule').child('4').set('empty')



                    var user_groups = [];
                    firebase.database().ref('users/' + uid + '/groups')
                        .once('value', function (snapshot) {
                                snapshot.forEach(function (childSnapshot) {
                                    var childData = childSnapshot.val();
                                    user_groups = user_groups.concat([childData]);
                                });
                            }
                        ).then(
                            () => {

                                user_groups = user_groups.concat([groupKey]);
                                if (user_groups.length === 1) {
                                    firebase.database().ref('users/' + uid + '/groups').set([groupKey]);
                                }
                                else {
                                    firebase.database().ref('users/' + uid + '/groups').set(user_groups);
                                }

                            }
                        )
                        .catch(error => {
                            console.log(error)
                        });
                    alert("Your Group Code: "+ groupKey)


                })
                .catch(error => {
                    console.log('error', error)
                    commit('setError', error.message);
                    commit('setLoading', false)
                })



        },
        loadGroupsInfo({commit}) {
            let userGroupsRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid).orderByKey()
            let groupsInfo = []
            userGroupsRef.on('value', snapshot => {
                // commit('setUserGroupsInfo', {userGroupsInfo : []})
                snapshot.forEach(childSnapshot => {
                    for (let i=0; i<childSnapshot.val().length; i++) {
                        let gId = childSnapshot.val()[i]
                        let groupsRef = firebase.database().ref('groups/' + gId);
                        groupsRef.on('value', groupSnapshot => {
                            groupsInfo.push({
                                groupId: gId,
                                ...groupSnapshot.val()
                            })
                        })
                    }
                })
            })
            commit('setUserGroupsInfo', {userGroupsInfo : groupsInfo})
        },
        updateDisplayName({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updateProfile({displayName: payload.displayName})
                .then(() => {
                    commit('setLoading', false)
                })
        },
        updateEmail({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updateEmail(payload.email)
                .then(f => {
                    commit('setLoading', false)
                })
        },
        reauthenticateUser({commit}, payload) {
            commit('setLoading', true)
            const credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
            firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
                .then(f => {
                    commit('setLoading', false)
                    commit('setError', null)
                })
                .catch(error => {
                    console.log(error)
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        changePassword({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updatePassword(payload.new_password).then(function(){
                commit('setLoading',false)
                router.push('/profile')
            }).catch(function(error){
                commit('setError', error.message)
                commit('setLoading', false)
            })
        }

    },
    loadGroupsInfo({commit}) {
        console.log('loadGroupsInfo')
        let userGroupsRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid).orderByKey()
        let groupsInfo = []
        userGroupsRef.on('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                for (let i=0; i<childSnapshot.val().length; i++) {
                    let gId = childSnapshot.val()[i]
                    let groupsRef = firebase.database().ref('groups/' + gId);
                    groupsRef.on('value', groupSnapshot => {
                        groupsInfo.push({
                            groupId: gId,
                            ...groupSnapshot.val()
                        })
                    })
                }
            })
        })
        commit('setUserGroupsInfo', {userGroupsInfo : groupsInfo})
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        getUserGroupKey: state => {
            return state.userGroupKeys;
        },
        getUserGroupsInfo(state) {
            return state.userGroupsInfo
        },
        getUser(state) {
            return state.user
        },
        getError(state) {
            return state.error
        }
    }
})
