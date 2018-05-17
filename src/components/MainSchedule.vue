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
                                        <v-btn icon class="mx-0" @click.stop="editEvent(props.item)">
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
                            <span class="headline">Edit event</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap column>
                                    <!--<v-flex>-->
                                        <!--<v-alert type="error" dismissible v-model="alert">-->
                                            <!--{{ error }}-->
                                        <!--</v-alert>-->
                                    <!--</v-flex>-->
                                    <v-flex>
                                        <v-text-field
                                                name="Event Title"
                                                label="Title"
                                                id="eventTitle"
                                                type="text"
                                                v-model="title"
                                                required>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-menu
                                                ref="menuS"
                                                :close-on-content-click="false"
                                                v-model="menu1"
                                                :nudge-right="40"
                                                :return-value.sync="dateStart"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <v-text-field
                                                    slot="activator"
                                                    v-model="dateStart"
                                                    label="Start Time"
                                                    prepend-icon="access_time"
                                                    readonly
                                            ></v-text-field>
                                            <v-time-picker v-model="dateStart" @change="$refs.menuS.save(dateStart)"></v-time-picker>
                                        </v-menu>

                                    </v-flex>
                                    <v-flex>
                                        <v-menu
                                                ref="menuE"
                                                :close-on-content-click="false"
                                                v-model="menu2"
                                                :nudge-right="40"
                                                :return-value.sync="dateEnd"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                max-width="290px"
                                                min-width="290px"
                                        >
                                            <v-text-field
                                                    slot="activator"
                                                    v-model="dateEnd"
                                                    label="End Time"
                                                    prepend-icon="access_time"
                                                    readonly
                                            ></v-text-field>
                                            <v-time-picker v-model="dateEnd" @change="$refs.menuE.save(dateEnd)"></v-time-picker>
                                        </v-menu>

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
                dialog: false,
                title: '',
                dateStart: null,
                dateEnd: null,
                menu1 :false,
                menu2 :false,
                alert :false,
            }
        },
        methods: {
            editEvent(eventData) {
                this.dialog = true

                console.log(eventData)
            }
        },
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
            },
            groupId() {
                return this.$route.params.groupId
            }
        },
        created() {
            let scheduleRef = db.ref("groups/" + this.groupId + "/groupSchedule")
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
            let groupLeaderRef = db.ref("groups/" + this.groupId + "/groupLeader")
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
