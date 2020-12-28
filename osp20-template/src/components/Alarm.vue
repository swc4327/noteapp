<template>
  <div class="alarm">
    <b-modal v-model="alarmShow" title="알람">
      <b-container fluid>
          <p class="p-1 text-center">{{ this.alarm.title }}</p>
          <p class="p-1 text-center">{{ this.alarm.alarm }}</p>
      </b-container>
      <template v-slot:modal-footer="{ ok }">
        <b-button size="sm" variant="success" @click="ok()">확인</b-button>
      </template>
    </b-modal>
  
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
const noteStore = 'noteStore';

export default {
  props: {
    alarmNotes: Array,
  },
  data() {
    return {
      alarmShow: false,
      notification: '',
      nowTime: '',
      alarms: '',
      alarm: {title:'init', alarm: '0000-00-00 00:00'},
    }
  },
  created() {
    setInterval(() => 
      this.nowTime = this.$moment().format('YYYY-MM-DD HH:mm:ss'), 1000);
  },
  methods: {
    ...mapMutations(noteStore, {
      insertNote: "insertNote",
    }),
    deleteAlarm() {
      this.alarms[0].alarm = "";
      this.insertNote({uid: this.alarms[0].uid, note: this.alarms[0]});
    }
  },
  computed: {
    ...mapGetters(noteStore, {
      getNoteList : "getNoteList",
      getNote : "getNote",
    }),
    getAlarmNotes: function() {
      return this.getNoteList.filter(note => note.alarm != '')
    },
    isAlarmNotes: function() {
      return this.getAlarmNotes ? true : false;
    }
  },
  watch: {
    getAlarmNotes: function() {
      if(this.isAlarmNotes) {
        this.alarms = this.getAlarmNotes;
        if (this.getAlarmNotes.length > 1) {
          this.alarms.sort((a, b) => {
            let timeA = new Date(a.alarm).getTime();
            let timeB = new Date(b.alarm).getTime();
            return timeA - timeB;
          })
        }
      }
    },
    nowTime: function() {
      if(this.alarms.length) {
        let timeNow = new Date(this.nowTime).getTime();
        let timeAlarm = new Date(this.alarms[0].alarm).getTime();
        if(timeNow == timeAlarm) {
          this.alarm = { title: this.alarms[0].title, alarm: this.alarms[0].alarm };
          this.alarmShow = true;
        }
        if(timeNow > timeAlarm) {
          this.deleteAlarm();
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
</style>