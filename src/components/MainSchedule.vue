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
                                        <v-btn icon class="mx-0" @click.stop="dialog = true">
                                            <v-icon color="teal">edit</v-icon>
                                        </v-btn>
                                        <v-btn icon class="mx-0" @click="">
                                            <v-icon color="pink">delete</v-icon>
                                        </v-btn>
                                    </div>
                                    <v-btn v-else icon class="mx-0" @click="">
                                        <v-icon color="blue">group_add</v-icon>
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-layout>
            <v-layout row justify-center>
                <v-dialog v-model="dialog" persistent max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">User Profile</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field label="Legal first name" required></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
                dialog: false
            }
        },
        methods: {},
        computed: {
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
            let groupId = this.$route.params.groupId
            let scheduleRef = db.ref("groups/" + groupId + "/groupSchedule")
            scheduleRef.on('value', snapshot => {
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
        }
    }
</script>

<style scoped>

</style>
