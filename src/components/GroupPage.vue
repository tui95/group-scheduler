<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm4 md8>
                <v-card class="elevation-12">
                    <v-card-title>
                        <div mb-3><h3 class="headline text-xs-left"> {{groupname}} </h3></div>
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
                                    <li v-for="member in group_members">
                                        <div>{{member}}</div>
                                    </li>
                                </ul>
                            </v-flex>
                            <h4>Schedule : <v-btn><v-icon left>event_note</v-icon>view all events</v-btn></h4>
                            <v-flex v-if="display">
                                <Schedule 
                                    :time-ground="['06:00', '22:00']" 
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
                groupname : '',
                group_description : '',
                group_members : [],
                alert : false,
                display : false,
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
            let tempSchedule = [[],[],[],[],[]]
            db.ref('groups/' + groupKey).once('value',snapshot => {
                console.log(snapshot.val())
                this.groupname = snapshot.val().groupName
                console.log(snapshot.val().groupName)
                this.group_description = snapshot.val().groupDescription
                console.log(snapshot.val().groupDescription)
                this.group_members = snapshot.val().groupMembers
                console.log(snapshot.val().groupMembers)
                if(snapshot.hasChild('groupSchedule')){
                    db.ref('groups/' + groupKey).child('groupSchedule').once('value',scheduleSnapshot => {
                        console.log('scheduleSnapshot',scheduleSnapshot)
                        scheduleSnapshot.forEach(childScheduleSnapshot=>{
                            let childKey = childScheduleSnapshot.key
                            let childData = childScheduleSnapshot.val()

                            childData.forEach(data =>{
                                var newEvent = {
                                    dateEnd : data.dateEnd,
                                    dateStart : data.dateStart,
                                    title : data.title,
                                }
                                this.schedule[childKey].push(newEvent)

                            })
                        })
                    })
                    .then(() => {this.display = true})
                }
            })
            .then(() => {
                console.log("DONE")
            })
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
