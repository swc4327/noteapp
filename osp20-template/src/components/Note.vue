<template>
  <div class="note" :style="{ 'background-color': this.getNote(uid).theme }">
    <div class="icon-toolbar">
      <span class="toolbox">
        <i class="fas fa-thumbtack" @click.prevent="pinNote(uid)"></i>
        <i class="fas fa-trash" @click.prevent="deleteNote(uid)"></i>
      </span>
    </div>

    <div @click.prevent="openEditor(uid)">
      <span class="title">{{ this.getNote(uid).title }}</span>
      <p class="text" v-html="this.getNote(uid).text"></p>
      <p class="author">
        Written by <b>{{ getAuthor }}</b>
      </p>
      <p class="timestamp">
        Latest edit at <b>{{ getUpdateDate }}</b>
      </p>
      <div v-if="this.getNote(uid).labels[0]" class="labelContainer">
        <span
          v-for="(label, index) in this.getNote(uid).labels"
          :key="`${index}-${label}`"
          class="note-label"
          >{{ label }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
const noteStore = "noteStore";

export default {
  props: {
    uid: String,
  },
  methods: {
    ...mapMutations(noteStore, {
      openEditor: "openEditor",
      deleteNote: "deleteNote",
      pinNote: "pinNote",
    }),
  },
  computed: {
    ...mapGetters(noteStore, {
      getNote: "getNote",
      getIndex: "getIndex",
    }),
    getAuthor: function () {
      return this.getNote(this.uid).author
        ? this.getNote(this.uid).author
        : "Anonymous";
    },
    getUpdateDate: function () {
      return this.$moment(this.getNote(this.uid).updateDate).fromNow();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/note.scss";
</style>