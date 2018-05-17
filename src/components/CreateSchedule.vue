<template>
    <v-container >
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
            {{this.schedule}}

        </form>

    </v-container>
</template>

<script>
import Schedule from './schedule/Schedule'
import { auth, db } from '@/firebase'

export default {
    components : {Schedule},
    data(){
        return{
            display:false,
            menu1 :false,
            menu2 :false,
            alert :false,
            title :'',
            dateStart: null,
            dateEnd : null,
            schedule:[[],[],[],[],[]],
    
            selectedDay : '',

        }
    },
    created(){
        console.log('hi')
        console.log(this.schedule)
        // All in one page
        const groupId = this.$route.params.groupId

        db.ref('groups/'+ groupId).once('value',snapsot=>{
            //check if exist
            if(snapsot.hasChild('groupSchedule')){

                db.ref('groups/'+groupId)
                .child('groupSchedule')
                .once('value', scheduleSnapshot=>{
                    scheduleSnapshot.forEach(childScheduleSnapshot=>{
                        let childKey = childScheduleSnapshot.key
                        let childData = childScheduleSnapshot.val()
                        if(childData==='empty'){
                            this.schedule[childKey] = childData;
                        }
                        else{
                            childData.forEach(data=>{
                                var newEvent = {
                                    dateEnd : data.dateEnd,
                                    dateStart : data.dateStart,
                                    title : data.title,
                                }
                                this.schedule[childKey].push(newEvent)
                                // console.log(data)
                            })
                        }
                    })
                })

            }

        })
        .then(()=>{
            console.log('DONE')
            console.log(this.schedule); 
        })
    },
    methods :{
        isOverlap(){
            var i=0;
            var dayIndex = this.days.indexOf(this.selectedDay);
            let dayEvents = this.schedule[dayIndex]
            console.log(dayEvents)
            if(dayEvents ==='empty')return false
            else{
                var existDateStart, existDateEnd
                for(i;i<dayEvents.length;i++){
                    existDateStart = dayEvents[i].dateStart
                    existDateEnd  = dayEvents[i].dateEnd
                    if((existDateStart <= this.dateStart && this.dateStart <=existDateEnd) ||
                       (existDateStart <= this.dateEnd && this.dateEnd <=existDateEnd) ||
                       (existDateStart <= this.dateStart && this.dateStart <=existDateEnd) ||
                    ((this.dateStart <= existDateStart) && (this.dateEnd>= existDateEnd))
                    ){
                        return true
                    }

                }
            }
            return false
        },
        addEvent({commit}){

            const groupId = this.$route.params.groupId
            // const groupId = $route.params.groupId
            if (!this.dateStart || !this.dateEnd){
                alert("Start Time and Date End must not leave empty")
            
            }
            else{
                const dateStartInt = parseInt(this.dateStart.replace(/:/g,''));
                const dateEndInt = parseInt(this.dateEnd.replace(/:/g,''));
                console.log(dateStartInt, dateEndInt)
                if (dateStartInt>dateEndInt){
                    console.log('End time must be after Start Time')
                    alert('End time must not come before Start Time')
                }
                if (dateStartInt <800 ||
                    dateEndInt < 800 ||
                    dateStartInt >2000||
                    dateEndInt >2000)
                    {
                        console.log('The start and end time must be between 8:00 and 20:00')

                        alert('The start and end time must be between 8:00 and 20:00')
                
                }
                if(this.isOverlap()){
                    console.log("The time period is overlapped with other events")
                    alert("The time period is overlapped with other events")
                    
                }
                else{
                    var index = this.days.indexOf(this.selectedDay)

                    const email = auth.currentUser.email
                    const newEvent = {
                        dateStart: this.dateStart,
                        dateEnd: this.dateEnd,
                        title: this.title,
                        registeredUser : [email],
                    }
                    if(this.schedule[index].indexOf("empty")>-1){
                        
                        this.schedule[index]=[newEvent]
                    }
                    else{   
                        this.schedule[index].push(newEvent)
                    }
                    // console.log(this.schedule)
                    db.ref('groups/'+groupId).child('groupSchedule').set(this.schedule)

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
            },
            days(){
                return ['Monday','Tuesday','Wednesday','Thursday','Friday']
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
