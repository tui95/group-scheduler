<template>
    <v-container>
        <v-flex>
            <v-layout xs12 sm8 offset-sm2>
                <v-expansion-panel>
                    <v-expansion-panel-content v-for="(day,i) in schedule" :key="i">
                        <div slot="header">{{day.dayString}}</div>
                        <v-data-table
                                :headers="headers"
                                :items="day.events"
                                hide-actions
                                class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-center">{{ props.item.title }}</td>
                                <td class="text-xs-center">{{ props.item.dateStart}}</td>
                                <td class="text-xs-center">{{ props.item.dateEnd }}</td>
                                <td class="justify-center layout px-0">
                                    <div v-if="isGroupLeader">
                                        <v-btn icon class="mx-0" @click="">
                                            <v-icon color="teal">edit</v-icon>
                                        </v-btn>
                                        <v-btn icon class="mx-0" @click.stop="dialog2 = true">
                                            <v-icon color="pink">delete</v-icon>
                                        </v-btn>
                                    </div>
                                    

                                    <v-btn v-if="isJoinEvent(props.item.registeredUser)" disabled icon class="mx-0" >
                                        <v-icon color="blue">group_add</v-icon>
                                    </v-btn>    

                                    <v-btn v-else icon class="mx-0" @click.stop="dialog3 = true">
                                        <v-icon color="blue">group_add</v-icon>
                                    </v-btn>

                                    <v-dialog v-model="dialog3" max-width="500px">
                                        <v-card>
                                            <v-card-title>
                                                <span>Do you want to register for this event?</span>
                                                <v-spacer></v-spacer>
                                                
                                            </v-card-title>
                                            <v-card-actions>
                                                <v-btn color="primary" flat @click.stop="dialog3=false">Close</v-btn>
                                                <v-btn color="primary" flat @click.stop="dialog3=false"
                                                @click="joinEvent(day.dayString,props.index)">Register</v-btn>
                                            
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                    <v-dialog v-model="dialog2" max-width="500px">
                                        <v-card>
                                            <v-card-title>
                                                <span>Do you want to remove this event?</span>
                                                <v-spacer></v-spacer>
                                                
                                            </v-card-title>
                                            <v-card-actions>
                                                <v-btn color="primary" flat @click.stop="dialog2=false">Close</v-btn>
                                                <v-btn color="primary" flat @click.stop="dialog2=false"
                                                @click="deleteEvent(day.dayString,props.index)">Delete</v-btn>
                                            
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                </td>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-layout>
        </v-flex>
        </v-container>
</template>

<script>
    import { db, auth } from "@/firebase"

    export default {
        data() {
            return {
                schedule: [],
                isGroupLeader: false,
                dialog3: false,
                dialog2: false,
            }
        },
        methods: {
            isJoinEvent(registeredUser){
                if(registeredUser){
                    const user = auth.currentUser.email
                    if(registeredUser.indexOf(user)> -1)return true
                    
                }
                return false
            },
            joinEvent(dayString, eventIndex){
                const user = auth.currentUser.email
                const dayIndex=  this.days.indexOf(dayString);
                let groupId = this.$route.params.groupId
                 this.schedule[dayIndex].events[eventIndex].registeredUser.push(user);
                let newRegisteredUser = this.schedule[dayIndex].events[eventIndex].registeredUser;
                db.ref('groups/'+groupId+'/groupSchedule/'+dayIndex+'/'+eventIndex).child('registeredUser').set(newRegisteredUser);
            },
            deleteEvent(dayString,eventIndex){

                const user = auth.currentUser.email
                const dayIndex=  this.days.indexOf(dayString);
                let groupId = this.$route.params.groupId
                this.schedule[dayIndex].events.splice(eventIndex,1);
                // let newRegisteredUser = this.schedule[dayIndex].events[eventIndex].registeredUser;
                console.log(this.schedule[dayIndex].events)
                if(this.schedule[dayIndex].events.length===0){
                    db.ref('groups/'+groupId+'/groupSchedule/'+dayIndex+'/').set("empty");
                }
                else{
                    db.ref('groups/'+groupId+'/groupSchedule/'+dayIndex+'/').set(this.schedule[dayIndex].events);
                }
            
            }
        },
        computed: {
            getData(){
                let groupId = this.$route.params.groupId
            let scheduleRef = db.ref("groups/" + groupId + "/groupSchedule")
                scheduleRef.on('value', snapshot => {
                    this.schedule=[]
                    snapshot.forEach(daySnapshot => {
                        let day = this.days[daySnapshot.key]
                        let tmpEvents = []
                        daySnapshot.forEach(eventSnapshot => {
                            console.log(eventSnapshot.val())
                            tmpEvents.push(eventSnapshot.val())
                        })
                        this.schedule.push({dayString: day, events: tmpEvents})
                    })
                })
                let groupLeaderRef = db.ref("groups/" + groupId + "/groupLeader")
                groupLeaderRef.on("value", snapshot => {
                    if (snapshot.val() === auth.currentUser.email) {
                        this.isGroupLeader = true
                    }
                })
            },
            days() {
                return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            headers() {
                let headerText = ["Event Name", "Start Time", "End Time"]
                let headerValue = ["title", "dateStart", "dateEnd"]
                let headerAlign = "center"
                let retHeaders = []
                for (let i=0; i<headerText.length; i++) {
                    retHeaders.push({
                        text: headerText[i],
                        value: headerValue[i],
                        align: headerAlign
                    })
                }
                retHeaders.push({
                    text: "Action",
                    value: "",
                    align: "center",
                    sortable: false
                })
                return retHeaders
            }
        },
        created() {
            this.getData
            
        }
    }
</script>

<style scoped>

</style>
