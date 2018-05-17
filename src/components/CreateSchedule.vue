<template>
    <v-container v-if="display">
        <form @submit.prevent="addEvent">

            <v-layout column>
                <v-flex>
                    <h1>Create Event</h1>
                </v-flex>
                <v-flex>
                    <v-alert type="error" dismissible v-model="alert">
                        {{ error }}
                    </v-alert>
                </v-flex>
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
                    <v-select
                        :items="days"
                        v-model="selectedDay"
                        label="Select Date"
                        single-line
                        ></v-select>
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
                <v-flex class="text-xs-center" mt-5>
                    <v-btn color="primary" type="submit">Create</v-btn>
                </v-flex>
            </v-layout>
            {{title}}
            {{selectedDay}}
            {{dateStart}}
            {{dateEnd}}
            
        </form>

        <!-- {{schedule}} -->
        for the sake of testing
        <Schedule 
			:time-ground="['06:00', '22:00']" 
			:week-ground="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']" 
			:task-detail="schedule">
				
		</Schedule>
        
    </v-container>
</template>

<script>
import Schedule from './schedule/Schedule'
import { auth, db } from '@/firebase'

export default {
    components : {Schedule},
    props : ['groupKey'],
    data(){
        return{
            display:false,
            menu1 :false,
            menu2 :false,
            alert :false,
            title :'',
            dateStart: null,
            dateEnd : null,
            // schedule:[[],[],[],[],[]],
            schedule: [
				[
					{
						dateStart: '09:30',
						dateEnd: '10:30',
                        title: '开会',
                        fnck : '12w',
					},
					{
						dateStart: '11:30',
						dateEnd: '13:50',
						title: '开会',
					}

				],
                [],
                [],
                [],
                []
			],
            
        
    
            
            days : ['Monday','Tuesday','Wednesday','Thursday','Friday'],
            
            selectedDay : '',
            
        }
    },
    created(){
        console.log('hi')
        console.log(this.schedule)
        // All in one page
        const groupKey ="-LCdBX6_LyyhbHn8m793" //tempory
        let tempSchedule = [[],[],[],[],[]]
        db.ref('groups/'+ groupKey).once('value',snapsot=>{
            //check if exist
            if(snapsot.hasChild('groupSchedule')){

                db.ref('groups/'+groupKey)
                .child('groupSchedule')
                .once('value', scheduleSnapshot=>{
                    console.log('scheduleSnapshot',scheduleSnapshot)
                    scheduleSnapshot.forEach(childScheduleSnapshot=>{
                        let childKey = childScheduleSnapshot.key
                        let childData = childScheduleSnapshot.val()
                        // console.log(childKey)
                        // console.log(childData)

                        childData.forEach(data=>{
                            var newEvent = {
                                dateEnd : data.dateEnd,
                                dateStart : data.dateStart,
                                title : data.title,                                
                            }
                            this.schedule[childKey].push(newEvent)
                            // console.log(data)
                        })
                    })
                })
                .then(()=>{this.display=true})

            }

        })
        .then(()=>{
            console.log('DONE')
        })
    },
    methods :{ 
        addEvent({commit}){
            const groupKey ="-LCdBX6_LyyhbHn8m793" //tempory
            // const groupKey = $route.params.groupKey
            if (!this.dateStart || !this.dateEnd){
                alert("Start Time and Date End must not leave empty")
            }
            else{
                const dateStartInt = parseInt(this.dateStart.replace(/:/g,''));
                const dateEndInt = parseInt(this.dateEnd.replace(/:/g,''));
                console.log(dateStartInt, dateEndInt)
                if (dateStartInt <800 || 
                    dateEndInt < 800 || 
                    dateStartInt >2000||
                    dateEndInt >2000||
                    dateStartInt>dateEndInt){
                    console.log('End time must be after Start Time')
                    alert('End time must not come before Start Time')
                }
                else{
                    var index =0
                    if (this.selectedDay ==='Monday'){
                        index=0
                    }
                    else if (this.selectedDay ==='Tuesday'){
                        index=1
                    }
                    else if (this.selectedDay ==='Wednesday'){
                        index=2
                    }
                    else if (this.selectedDay ==='Thursday'){
                        index=3
                    }
                    else if (this.selectedDay === 'Friday'){
                        index=4
                    }
                    const newEvent = {
                        dateStart: this.dateStart,
                        dateEnd: this.dateEnd,
                        title: this.title,
                        registeredUser : [],
                    }
                    this.schedule[index].push(newEvent)
                    db.ref('groups/'+groupKey).child('groupSchedule').set(this.schedule)

                    this.dateStart = null
                    this.dateEnd = null
                    this.title = ''
                    this.selectedDay =''
                }
            }
            
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

<style>

</style>
