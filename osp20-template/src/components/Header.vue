<template>
  <div class="header">
    <b-button
      class="btn btn-menu"
      title="사이드 메뉴 열기"
      size="sm"
      v-b-toggle.sidebar
      ><i class="fas fa-bars fa-lg"></i
    ></b-button>
    <transition name="search-slide-fade">
      <b-container class="search-container" v-show="opensearch">
        <b-button
          class="btn btn-menu"
          title="검색 닫기"
          size="sm"
          @click.prevent="openSearch()"
          ><i class="fas fa-arrow-left"></i
        ></b-button>
        <b-form-input
          class="search-container-input"
          size="lg"
          type="search"
          v-model="keyword"
          placeholder="검색어를 입력하세요..."
          @keyup.enter="searchKeyword()"
        >
        </b-form-input>
      </b-container>
    </transition>
    <img src="../assets/notelogo.png" />
    <p>Sticky Notes</p>

    <b-button
      class="btn btn-search"
      title="검색"
      size="sm"
      @click.prevent="openSearch()"
      ><i class="fas fa-search fa-lg"></i
    ></b-button>

    <div class="searchBar border-bottom">
      <i class="fas fa-search fa-lg"></i>
      <b-form-input
        class="input-search text-light rounded-0 border-0 bg-transparent"
        size="lg"
        type="search"
        v-model="keyword"
        placeholder="검색어를 입력하세요..."
        @keyup.enter="searchKeyword()"
      >
      </b-form-input>
    </div>

    <b-button
      class="btn btn-menu"
      title="노트 추가"
      @click.prevent="openEditor(null)"
      ><i :class="editerIcon" ></i
    ></b-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
const noteStore = "noteStore";

export default {
  data: function () {
    return {
      keyword: "",
      opensearch: false,
    };
  },
  methods: {
    ...mapMutations(noteStore, {
      openEditor: "openEditor",
    }),
    searchKeyword: function () {
      if (this.keyword) {
        for (var i = 0; i < this.getNoteList.length; i++) {
          let searchLabel_ = "";
          let tagRegex = /<(.*?)>/gi;
          let searchNote_ =
            this.getNoteList[i].title +
            " " +
            this.getNoteList[i].author +
            " " +
            this.getNoteList[i].text.replace(tagRegex, " ");
          for (var j = 0; j < this.getNoteList[i].labels.length; j++) {
            searchLabel_ = searchLabel_ + " " + this.getNoteList[i].labels[j];
          }
          let searchString = searchNote_ + " " + searchLabel_;

          //console.log(searchString);
          if (searchString.includes(this.keyword))
            this.getNoteList[i].search = true;
          else this.getNoteList[i].search = false;
        }
      } else {
        for (i = 0; i < this.getNoteList.length; i++) {
          this.getNoteList[i].search = false;
        }
      }
    },
    openSearch: function () {
      this.opensearch = !this.opensearch;
    },
  },
  computed: {
    ...mapGetters(noteStore, {
      getNoteList: "getNoteList",
      isEditorOpen: "getIsEditorOpen",
    }),
    editerIcon() {
      if (this.isEditorOpen)
        return "fas fa-times fa-lg";
      else
        return "fas fa-plus fa-lg";
    },
  },
  watch: {
    keyword: function () {
      if (this.keyword == "") this.searchKeyword();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/header.scss";
</style>