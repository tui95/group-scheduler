<template>
    <v-container fluid fill-height v-if="display">
        <v-layout align-center justify-center>
            <v-flex xs12 sm4 md8>
                <v-card class="elevation-12">
                    <v-card-title>
                        <div my-3><h3 class="headline text-xs-left"> {{groupname}} </h3></div>
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
                            <v-flex my-3>
                                
                            </v-flex>
                            <h4>Schedule : <v-btn><v-icon left>event_note</v-icon>view all events</v-btn></h4>
                            <v-flex>
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
        props : ['groupkey'],
        components : {Schedule},
        data() {
            return {
                groupname : '',
                group_description : '',
                group_members : [],
                alert : false,
                display : false,
                dataStart : null,
                dataEnd : null,
                schedule : [[],[],[],[],[]],
                day : ['Monday','Tuesday','Wednesday','Thursday','Friday']
            }
        },
        created() {
            console.log('creating group page for')
            console.log(this.schedule)
            // const groupKey = 
            const groupKey = "-LCdBX6_LyyhbHn8m793" //for testing
            let tempSchedule = [[],[],[],[],[]]
            db.ref('groups/' + groupKey).once('value',snapshot => {
                this.groupname = snapshot.groupName
                this.group_description = snapshot.groupDescription
                // this.group_members = {member : snapshot.}
                if(snapshot.hasChild('groupSchedule')){
                    db.ref('groups/' + groupKey).child('groupSchedule').once('value',scheduleSnapshot => {
                        console.log('scheduleSnapshot',scheduleSnapshot)
                        scheduleSnapshot.forEach(childScheduleSnapshot=>{
                            let childKey = childScheduleSnapshot.key
                            let childData = childScheduleSnapshot.val()

                            childData.forEach(data =>{
                                var newEvent = {
                                    dataEnd : data.dateEnd,
                                    dataStart : data.dateStart,
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
