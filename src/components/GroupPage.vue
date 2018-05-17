<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm4 md8>
                <v-card class="elevation-12">
                    <v-card-title>
                        <div mb-3>
                            <h3 class="headline text-xs-left"> {{groupname}} 

                                <v-btn v-if="!isGroupLeader" fab left @click.stop="dialog1 = true">
                                 <v-icon >close</v-icon>
                            </v-btn>
                            </h3>

                            <v-dialog v-model="dialog1" max-width="500px">
                                <v-card>
                                    <v-card-title>
                                        <span>Do you want to leave the group?</span>
                                        <v-spacer></v-spacer>
                                        
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-btn color="primary" flat @click.stop="dialog1=false">Close</v-btn>
                                        <v-btn color="primary" flat @click.stop="dialog1=false"
                                        @click="leaveGroup">Leave</v-btn>
                                    
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                             
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="text-xs-left">
                        <v-layout column>
                            <v-flex my-3>
                                <v-alert type="error" dismissible v-model="alert">
                                    {{error}}
                                </v-alert>
                            </v-flex>
                            <h4>Description :</h4>
                            <v-flex my-3>
                                <div>{{group_description}}</div>
                            </v-flex>
                            <h4>Members :</h4>
                            <v-flex ml-3 my-3>
                                <!-- <div>{{group_members}}</div> -->
                                <ul id="members">
                                    <li v-for="(member,index) in group_members" :key="index">
                                        <div>{{member}}</div>
                                    </li>
                                </ul>
                            </v-flex>
                            <h4>Schedule : <v-btn><v-icon left>event_note</v-icon>view all events</v-btn></h4>
                            <v-flex v-if="display">
                                <Schedule
                                    :time-ground="['08:00', '20:00']"
                                    :week-ground="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']"
                                    :task-detail="schedule">
                                </Schedule>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Schedule from './schedule/Schedule'
    import {auth, db} from '@/firebase'

    export default {
        components : {Schedule},
        data() {
            return {
                isGroupLeader : false,
                dialog1 : false,
                display : false,
                groupname : '',
                group_description : '',
                group_members : [],
                alert : false,
                title : '',
                dateEnd : null,
                dateStart : null,
                schedule : [[],[],[],[],[]],
                day : ['Monday','Tuesday','Wednesday','Thursday','Friday']
            }
        },
        created() {
            console.log('creating group page for' + this.$route.params.groupId)
            const groupKey = this.$route.params.groupId
            db.ref('groups/' + groupKey).once('value',snapshot => {
                console.log(snapshot.val())
                this.groupname = snapshot.val().groupName
                this.group_description = snapshot.val().groupDescription
                this.group_members = snapshot.val().groupMembers
                if(snapshot.hasChild('groupSchedule')){
                    db.ref('groups/' + groupKey).child('groupSchedule').once('value',scheduleSnapshot => {
                        scheduleSnapshot.forEach(childScheduleSnapshot=>{
                            let childKey = childScheduleSnapshot.key
                            let childData = childScheduleSnapshot.val()

                            if(childData === 'empty'){
                                this.schedule[childKey] = []
                            }
                            else{
                                childData.forEach(data =>{
                                    var newEvent = {
                                        dateEnd : data.dateEnd,
                                        dateStart : data.dateStart,
                                        title : data.title,
                                        registeredUser : data.registeredUser
                                        
                                    }
                                    this.schedule[childKey].push(newEvent)

                            })
                            }
                            
                        })
                    }).then(()=>this.display=true)
                }
            })

            let groupLeaderRef = db.ref("groups/" + groupKey + "/groupLeader")
                groupLeaderRef.on("value", snapshot => {
                    console.log(snapshot)
                    if (snapshot.val() === auth.currentUser.email) {
                        this.isGroupLeader = true
                        console.log(this.isGroupLeader)
                    }
                })
        },
        methods : {
            leaveGroup(){
                const groupkey = this.$route.params.groupId
                const user = auth.currentUser.email
                let group_members=[]
                db.ref('groups/'+groupkey).child('groupMembers').once('value', snapshot=>{
                    snapshot.forEach(child=>{
                        console.log(child.key)
                        console.log(child.val())
                        if(!(child.val()===user)){
                            group_members.push(child.val())    
                        }                    
                    })
                }).then(()=>{
                    // db.ref('groups/'+groupkey).child('groupMembers').set(group_members)
                })
                let user_groups=[]
                db.ref('users/'+auth.currentUser.uid+'/groups').once('value', snapshot=>{
                    snapshot.forEach(child=>{
                        if(!(child.val()===groupkey)){
                            user_groups.push(child.val())
                        }
                    })
                }).then(()=>{
                    db.ref('users/'+auth.currentUser.uid+'/groups').set(user_groups)
                })

                this.$router.push('/')


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
        }
    }
</script>
