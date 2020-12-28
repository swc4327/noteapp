<template>
  <div id="app">
    <app-header></app-header>
    <app-alarm></app-alarm>
    <app-slide-menu></app-slide-menu>

    <transition name="editor">
      <app-note-editor v-if="isEditorOpen"></app-note-editor>
    </transition>
    <hr v-if="isEditorOpen" class="my-2" />

    <span v-if="searchedNotes[0]" class="container-name m-4">검색 결과</span>
    <div id="searched" class="noteContainer">
      <app-note
        v-for="(note, index) in searchedNotes"
        :key="`note-${index}`"
        :uid="note.uid"
      ></app-note>
    </div>
    <hr v-if="searchedNotes[0]" class="my-2" />

    <span v-if="labeledNotes[0]" class="container-name m-4"
      >라벨이 달린 노트</span
    >
    <div id="labeled" class="noteContainer">
      <app-note
        v-for="(note, index) in labeledNotes"
        :key="`note-${index}`"
        :uid="note.uid"
      ></app-note>
    </div>
    <hr v-if="labeledNotes[0]" class="my-2" />

    <span v-if="pinnedNotes[0]" class="container-name m-4">고정한 노트</span>
    <div id="pinned" class="noteContainer">
      <app-note
        v-for="(note, index) in pinnedNotes"
        :key="`note-${index}`"
        :uid="note.uid"
      ></app-note>
    </div>
    <hr v-if="pinnedNotes[0]" class="my-2" />

    <span v-if="normalNotes[0]" class="container-name m-4">노트 목록</span>
    <div id="notpinned" class="noteContainer">
      <app-note
        v-for="(note, index) in normalNotes"
        :key="`note-${index}`"
        :uid="note.uid"
      ></app-note>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
const noteStore = 'noteStore';
const labelStore = 'labelStore';
const AIStore = 'AIStore';

import Header from './components/Header.vue';
import SlideMenu from './components/SlideMenu.vue';
import NoteEditor from './components/NoteEditor.vue';
import Note from './components/Note.vue';
import Alarm from './components/Alarm.vue';
import * as cocoSSD from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'

export default {
  name: "App",
  created() {
    this.notes = [
      {
        uid: this.$uuid.v4(),
        title: "Note Test 1",
        text: "text",
        theme: "#FF8A80",
        author: "osp20-14",
        createDate: this.$moment().format("YYYY-MM-DD HH:mm"),
        updateDate: this.$moment().format("YYYY-MM-DD HH:mm"),
        alarm: "2020-12-31 23:59",
        pin: false,
        search: false,
        isLabeled: false,
        labels: ["test label"],
        place: "",
      },
      {
        uid: this.$uuid.v4(),
        title: "Note Test 2",
        text: "뷰 애플리케이션",
        theme: "#AAAAFF",
        author: "osp20-14",
        createDate: this.$moment().format("YYYY-MM-DD HH:mm"),
        updateDate: this.$moment().format("YYYY-MM-DD HH:mm"),
        alarm: "2020-12-31 23:59",
        pin: false,
        search: false,
        isLabeled: false,
        labels: ["test label", "test label 2"],
        place: "",
      },
    ];
    this.labels = ["test label", "test label 2"];

    if (
      !localStorage.getItem("noteList") ||
      !localStorage.getItem("labelList")
    ) {
      // this.$store.commit('noteStore/mountNote', this.notes);
      // this.$store.commit('labelStore/mountLabel', this.labels);
      this.mountNote(this.notes);
      this.mountLabel(this.labels);
    }
  },
  methods: {
    ...mapMutations(noteStore, {
      insertNote: "insertNote",
      deletedNote: "deletedNote",
      mountNote: "mountNote",
    }),
    ...mapMutations(labelStore, {
      mountLabel: "mountLabel",
    }),
    ...mapMutations(AIStore, {
      mountModel: 'mountModel',
    }),
  },
  computed: {
    ...mapGetters(noteStore, {
      getNoteList: "getNoteList",
      isEditorOpen: "getIsEditorOpen",
    }),
    ...mapGetters(labelStore, {
      getLabelList: "getLabelList",
    }),
    searchedNotes: function () {
      return this.getNoteList.filter((note) => note.search);
    },
    labeledNotes: function () {
      return this.getNoteList.filter((note) => note.isLabeled);
    },
    pinnedNotes: function () {
      return this.getNoteList.filter((note) => note.pin);
    },
    normalNotes: function () {
      return this.getNoteList.filter((note) => !(note.pin || note.search));
    },
  },
  watch: {
    getNoteList: {
      handler() {
        var newNotes = this.getNoteList;
        localStorage.setItem("noteList", JSON.stringify(newNotes));
      },
      deep: true,
    },
    getLabelList: {
      handler() {
        var newLabels = this.getLabelList;
        localStorage.setItem("labelList", JSON.stringify(newLabels));
      },
      deep: true,
    },
  },
  async mounted() {
    if (localStorage.getItem('noteList')) {
      this.mountNote(JSON.parse(localStorage.getItem('noteList')));
    }
    if (localStorage.getItem("labelList")) {
      this.mountLabel(JSON.parse(localStorage.getItem("labelList")));
    }
    let model = await cocoSSD.load();
    this.mountModel(model);
    console.log("model loaded"); 
  },
  components: {
    appHeader: Header,
    appSlideMenu: SlideMenu,
    appNoteEditor: NoteEditor,
    appNote: Note,
    appAlarm: Alarm,
  },
};
</script>

<style lang="scss">
@import "/styles/global.scss";
.editor-enter-active {
  animation: bounce-in .7s;
}
.editor-leave-active {
  animation: bounce-in .7s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
