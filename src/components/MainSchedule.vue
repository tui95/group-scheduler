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
                                <td class="text-xs-center">hello</td>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-layout>
        </v-flex>
        {{schedule}}
    </v-container>
</template>

<script>
    import {db} from "@/firebase"

    export default {
        data() {
            return {
                schedule: []
            }
        },
        methods: {},
        computed: {
            days() {
                return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            headers() {
                let headerText = ["Event Name", "Start Time", "End Time", "Action"]
                let headerValue = ["title", "dateStart", "dateEnd", ""]
                let headerAlign = "center"
                let retHeaders = []
                for (let i=0; i<headerText.length; i++) {
                    retHeaders.push({
                        text: headerText[i],
                        value: headerValue[i],
                        align: headerAlign
                    })
                }
                return retHeaders
            }
        },
        created() {
            let groupId = this.$route.params.groupId
            // let testGroupId = "-LCdBX6_LyyhbHn8m793"
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
        }
    }
</script>

<style scoped>

</style>