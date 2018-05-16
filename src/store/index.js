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
        userGroupKeys: null,
        loading: false,
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
                    commit('setUser', {email: payload.email})
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
                            if (user_groups.length === 1) {
                                userRef.set([groupKey]);
                            }
                            else {
                                userRef.set(user_groups);
                            }
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

                    const groupRef = firebase.database().ref('groups/' + groupKey);
                    groupRef.child('groupName').set(payload.group_name);
                    groupRef.child('groupLeader').set(email)
                    groupRef.child('groupMembers').set([email])
                    groupRef.child('groupDescription').set(payload.group_description)

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
                snapshot.forEach(childSnapshot => {
                    let gId = childSnapshot.val()[0]
                    let groupsRef = firebase.database().ref('groups/' + gId);
                    groupsRef.on('value', groupSnapshot => {
                        groupsInfo.push({
                            groupId: gId,
                            ...groupSnapshot.val()
                        })
                    })
                })
            })
            console.log(groupsInfo)
            commit('setUserGroupsInfo', {userGroupsInfo : groupsInfo})
        }

    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        getUserGroupKey: state => {
            return state.userGroupKeys;
        }
    }
})
