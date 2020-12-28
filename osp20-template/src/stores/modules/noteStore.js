const noteStore = {
  namespaced: true,
  state: {
    isEditorOpen: false,
    selectNoteId: null,
    noteList: [],
  },
  getters: {
    getNoteList: state => {
      return state.noteList;
    },
    getNote: state => (uid) => {
      return state.noteList.find(note => note.uid === uid);
    },
    getIndex: state => (uid) => {
      const note = state.noteList.find(note => note.uid === uid);
      return state.noteList.indexOf(note);
    },
    getIsEditorOpen: state => {
      return state.isEditorOpen;
    },
    getSelectNoteId: state => {
      return state.selectNoteId;
    },
  },
  mutations: {
    openEditor: (state, uid) => {
      if (uid == null) {
        if (state.isEditorOpen)
          state.isEditorOpen = false;
        else 
          state.isEditorOpen = true;
      }
      else {
        if (state.selectNoteId == uid && state.isEditorOpen)
          state.isEditorOpen = false;
        else 
          state.isEditorOpen = true;
      }
      state.selectNoteId = uid;
      window.scrollTo(0,0);
    },
    mountNote: (state, notes) => {
      state.noteList = notes;
    },
    insertNote: (state, {uid, note}) => {
      const index = noteStore.getters.getIndex(state)(uid);
      console.log(index);

      if(index != -1) {
        state.noteList.splice(index, 1, note);
      }
      else {
        state.noteList.splice(state.noteList.length, 0, note);
      }
    },
    deleteNote: (state, uid) => {
      const index = noteStore.getters.getIndex(state)(uid);

      if(index != -1) {
        state.noteList.splice(index, 1);
        
        if (state.selectNoteId == uid)
          state.isEditorOpen = false;
      }
    },
    deleteAllNote: (state) => {
      state.noteList.splice(0, state.noteList.length);
    },
    pinNote: (state, uid) => {
      const note = noteStore.getters.getNote(state)(uid);
      note.pin = !note.pin;
    },
    setSelectNoteId: (state, uid) => {
      state.selectNoteId = uid;
    },
  },
  actions: {
  },
}
  
export default noteStore;