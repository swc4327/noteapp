<template>
  <b-sidebar id="sidebar" bg-variant="white" shadow="lg" width="280px">
    <div class="sidebar_header pl-4 pb-4">
      <img src="../assets/notelogo.png" width="64" height="64" />
      <p>Sticky Notes</p>
    </div>

    <div class="sidebar_title m-2">
      <i class="fas fa-tags"></i>
      <p class="my-auto">Label List</p>
    </div>

    <b-card>
      <template>
        <b-list-group>
          <b-form-tags style="border-color=#ffffff;" no-outer-focus>
            <b-input-group class="my-2">
              <b-form-input
                class="form-control"
                v-model="labelName"
                placeholder="추가 할 라벨 입력"
                @keyup.enter="addLabel()"
              ></b-form-input>
              <b-button class="btn-menu" @click="addLabel()"
                ><i class="fas fa-plus fa-lg"></i
              ></b-button>
            </b-input-group>

            <hr class="my-1" />

            <div class="d-inline-block" style="font-size: 1.2rem">
              <b-card
                v-for="label in getLabelList"
                :key="label"
                :id="`my-custom-tags-tag_${label.replace(/\s/g, '_')}_`"
                tag="li"
                class="my-1 label_container"
                body-class="py-1 pr-2 text-nowrap"
              >
                <b-button
                  class="label-tag"
                  variant="primary"
                  @click="filterLabel(label)"
                  >{{ label }}
                </b-button>
                <b-button
                  class="btn-del-label"
                  :aria-controls="`my-custom-tags-tag_${label.replace(
                    /\s/g,
                    '_'
                  )}_`"
                  @click="removeLabel(label)"
                  ><i class="fas fa-times"></i>
                </b-button>
              </b-card>
            </div>
          </b-form-tags>
        </b-list-group>
      </template>
    </b-card>

    <div class="sidebar_interct m-2" @click.prevent="deleteAllNote()">
      <i class="fas fa-trash-alt"></i>
      <p class="my-auto" title="메모를 모두 삭제합니다.">메모 모두 삭제</p>
    </div>
  </b-sidebar>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
const noteStore = "noteStore";
const labelStore = "labelStore";

export default {
  data: function () {
    return {
      labelName: "",
      filterOld: "",
    };
  },
  methods: {
    ...mapMutations(noteStore, {
      deleteNote: "deleteNote",
      deleteAllNote: "deleteAllNote",
    }),
    ...mapMutations(labelStore, {
      insertLabel: "insertLabel",
      deleteLabel: "deleteLabel",
    }),
    addLabel() {
      if (this.labelName) this.insertLabel(this.labelName);

      this.labelName = "";
    },
    removeLabel(label) {
      let _notes = this.getNoteList.filter((note) =>
        note.labels.includes(label)
      );
      //_notes = _notes.map((note) => note.uid);
      // for (let i = 0; i < _notes.length; i++) this.deleteNote(_notes[i]);
      for (let i = 0; i < _notes.length; i++) {
        let idx = _notes[i].labels.indexOf(label);
        if (idx > -1) _notes[i].labels.splice(idx, 1);
      }

      this.deleteLabel(label);
    },
    filterLabel(label) {
      for (let i = 0; i < this.getNoteList.length; i++)
        this.getNoteList[i].isLabeled = false;

      if (label != this.filterOld) {
        let _notes = this.getNoteList.filter((note) =>
          note.labels.includes(label)
        );
        for (let i = 0; i < _notes.length; i++)
          _notes[i].isLabeled = !_notes[i].isLabeled;

        this.filterOld = label;
      } else {
        this.filterOld = "";
      }
    },
  },
  computed: {
    ...mapGetters(noteStore, {
      getNoteList: "getNoteList",
    }),
    ...mapGetters(labelStore, {
      getLabelList: "getLabelList",
      getLabel: "getLabel",
    }),
  },
};
</script>

<style scoped lang="scss">
@import "../styles/slidemenu.scss";
</style>