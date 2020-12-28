<template>
  <div class="note-grid">
    <div class="note-editor" :style="{ 'background-color': note.theme }">
      <div class="alarm-set">
        <div class="radius-box">
          <span @click.prevent="isAlarmOpen = true">
            <i class="fas fa-bell"></i>
          </span>
          <p class="m-auto">{{ getAlarm }}</p>
          <span @click.prevent="deleteAlarm">
            <i class="fas fa-times"></i>
          </span>
        </div>
      </div>

      <b-modal v-model="isAlarmOpen" title="알람 설정" @ok="addAlarm">
        <b-container fluid>
          <b-row class="mb-2">
            <b-col cols="2" class="p-1 text-center">
              <p>날짜</p>
            </b-col>
            <b-col cols="8">
              <b-datepicker
                v-model="alarmDate"
                :min="this.$moment().format('YYYY-MM-DD')"
                class="mb-2"
              ></b-datepicker>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="2" class="p-1 text-center">
              <p>시간</p>
            </b-col>
            <b-col cols="8">
              <b-timepicker v-model="alarmTime" class="mb-2"></b-timepicker>
            </b-col>
          </b-row>
        </b-container>
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">설정</b-button>
        </template>
      </b-modal>

      <b-modal
        v-model="isImageUpload"
        title="이미지 업로드"
        @show="initImage()"
        @ok="execUploadImage()"
      >
        <b-container fluid>
          <b-row class="mb-2">
            <b-col class="mt-1 ml-3 p-1">
              <p>이미지</p>
            </b-col>
            <b-col cols="3">
              <label
                for="image-upload"
                class="mt-1 p-1 btn btn-outline-primary btn-sm"
                >파일 업로드</label
              >
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                :style="{ display: 'none' }"
                @change="setPreview($event)"
              />
            </b-col>
            <b-col cols="3">
              <button
                class="mt-1 p-1 btn btn-outline-secondary btn-sm"
                @click="toggleCam()"
              >{{ camButton }}</button>
            </b-col>
          </b-row>
          <b-row v-show="!isCamOpen">
            <b-col>
              <img id="preview" @load="loadImage()" />
            </b-col>
          </b-row>
          <b-row v-show="isCamOpen">
            <b-col>
              <video id="cam" autoplay="true" />
              <canvas id="capture" width="960" height="720" hidden />
            </b-col>
          </b-row>
          <b-row v-if="image" class="mt-2">
            <b-col cols="4" class="ml-3 p-1">
              <p>추천하는 라벨</p>
            </b-col>
            <b-col>
              <b-form-input
                type="search"
                v-model="imageClass"
                class="mb-2"
                :state="imageLabelState"
                aria-describedby="input-live-feedback"
                placeholder="사진에 라벨을 추가하세요!"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                이런! 해당 사진이 무엇인지 모르겠네요...
              </b-form-invalid-feedback>
            </b-col>
          </b-row>
          <hr class="mt-2" />
          <b-row class="mb-2">
            <b-col cols="4" class="mt-1 ml-3 p-1">
              <p>사이즈 조절</p>
            </b-col>
            <b-col>
              <b-form-input
                type="number"
                min="0"
                v-model="imageWidth"
                class="mb-2"
                placeholder="Width"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">업로드</b-button>
        </template>
      </b-modal>

      <b-modal
        v-model="isImageOCR"
        title="이미지에서 텍스트 추출"
        @show="initOCR()"
        @ok="execUploadText()"
      >
        <b-container fluid>
          <b-row class="mb-2">
            <b-col class="mt-1 ml-3 p-1">
              <p>이미지</p>
            </b-col>
            <b-col cols="3">
              <label
                for="image-upload"
                class="mt-1 p-1 btn btn-outline-primary btn-sm"
                >파일 업로드</label
              >
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                :style="{ display: 'none' }"
                @change="setPreview($event)"
              />
            </b-col>
            <b-col cols="3">
              <button
                class="mt-1 p-1 btn btn-outline-secondary btn-sm"
                @click="toggleCam()"
              >{{ camButton }}</button>
            </b-col>
          </b-row>
          <b-row v-show="!isCamOpen">
            <b-col>
              <img id="preview" @load="loadOCR()" />
            </b-col>
          </b-row>
          <b-row v-show="isCamOpen">
            <b-col>
              <video id="cam" autoplay="true" />
              <canvas id="capture" width="960" height="720" hidden />
            </b-col>
          </b-row>
          <hr class="mt-2" />
          <b-row>
            <b-col class="ml-3 p-1">
              <p>추출한 텍스트</p>
            </b-col>
            <b-col v-if="isProgressOCR" cols="1" class="ml-3 p-1">
              <div
                class="spinner-border spinner-border-sm text-primary p-1"
                role="status"
              ></div>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col>
              <b-form-textarea
                v-model="ocrText"
                class="mb-2"
                rows="3"
                max-rows="6"
                placeholder="Read Text..."
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-container>
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">업로드</b-button>
        </template>
      </b-modal>

      <b-modal
        id="input-url-modal"
        ref="modal"
        title="URL 입력창"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            :state="inputurlState"
            label="URL 입력"
            label-for="name-input"
            invalid-feedback="URL is required"
          >
            <b-form-input
              id="name-input"
              v-model="inputurl"
              :state="inputurlState"
              required
            ></b-form-input>
          </b-form-group>
        </form>
      </b-modal>

      <input
        class="title-input"
        type="text"
        placeholder="Title"
        v-model="note.title"
        :style="{ 'background-color': note.theme }"
      />
      <input
        class="author-input"
        type="text"
        placeholder="Author"
        v-model="note.author"
        :style="{ 'background-color': note.theme }"
      />
      <div
        ref="textEditor"
        class="text-input"
        contenteditable="true"
        placeholder="Take a note..."
        v-html="editText"
        @input="inputText"
        autofocus
      ></div>

      <div class="mb-2 tag-box-bg">
        <div class="m-1 radius-box">
          <span @click.prevent="mapToggle()">
            <i class="fas fa-map-marker-alt"></i>
          </span>
          <input
            class="place-input"
            type="text"
            placeholder="중요한 장소를 기록하세요!"
            v-model="note.place"
            @keyup.enter="function(){searchMap(note.place); mapOpen();}"
          />
          <span @click.prevent="note.place = ''">
            <i class="fas fa-times"></i>
          </span>
        </div>
        <div class="map-wrap">
          <div id="map" class="mb-2"></div>
          <button class="btnMapSwap btn btn-primary" @click="mapTypeSwap()"> 보기 전환 </button>
          <span class="btnZoomInControl" @click.prevent="mapZoomIn()">
            <i class="fas fa-plus"></i>
          </span>
          <span class="btnZoomOutControl" @click.prevent="mapZoomOut()">
            <i class="fas fa-minus"></i>
          </span>
        </div>
      </div>

      <b-form-tags
        v-model="note.labels"
        class="mb-2 tag-box-bg"
        size="lg"
        add-on-change
        no-outer-focus
      >
        <template
          v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }"
        >
          <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
            <li v-for="label in tags" :key="label" class="list-inline-item">
              <b-form-tag
                @remove="removeTag(label)"
                :title="label"
                :disabled="disabled"
                class="note-label-tag text-dark"
                >{{ label }}</b-form-tag
              >
            </li>
          </ul>

          <b-form-select
            v-bind="inputAttrs"
            v-on="inputHandlers"
            :disabled="disabled || availableLabels.length === 0"
            :options="availableLabels"
          >
            <template v-slot:first>
              <option disabled value="">&lt;= 라벨 선택 =&gt;</option>
            </template>
          </b-form-select>
        </template>
      </b-form-tags>

      <div class="toolbar-box">
        <label class="theme-input">
          <input
            type="color"
            class="color-picker"
            :value="note.theme"
            @change="changeTheme($event)"
          />
        </label>

        <div v-for="(item, index) in commands" :key="index">
          <button class="btn" @click="exec(item.command)">
            <i :class="'fas ' + item.icon"></i>
          </button>
        </div>

        <button class="btn" @click="isImageUpload = true">
          <i class="fas fa-image"></i>
        </button>

        <button class="btn" @click="isImageOCR = true">
          <i class="fas fa-magic"></i>
        </button>

        <button class="btn" v-b-modal.input-url-modal>
          <i class="fab fa-youtube"></i>
        </button>

        <button class="btn" @click.prevent="deleteNote(note.uid)">
          <i class="fas fa-trash"></i>
        </button>

        <span class="check-box-circle" @click.prevent="editNote">
          <i class="fas fa-edit"></i>
        </span>
      </div>
    </div>
  </div>
</template>


<script>
/* global kakao */ // 이 구문이 있어야 error 'kakao' is not defined no-undef 메시지가 안뜸
import { mapGetters, mapMutations } from "vuex";
const noteStore = "noteStore";
const labelStore = "labelStore";
const AIStore = "AIStore";

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import Tesseract from "tesseract.js";
import { createWorker } from "tesseract.js";

const defaultPlace = "금오공과대학교";
const commands = [
  { command: "bold", icon: "fa-bold" },
  { command: "italic", icon: "fa-italic" },
  { command: "strikeThrough", icon: "fa-strikethrough" },
  { command: "underline", icon: "fa-underline" },
  { command: "insertHorizontalRule", icon: "fa-minus" },
  { command: "insertOrderedList", icon: "fa-list-ol" },
  { command: "insertUnorderedList", icon: "fa-list-ul" },
];

export default {
  data: function () {
    return {
      note: "",
      commands: commands,
      editText: "",
      isAlarmOpen: false,
      isImageUpload: false,
      isImageOCR: false,
      isMapOpen: false,
      alarmDate: "",
      alarmTime: "",
      image: "",
      imageWidth: "",
      imageClass: "",
      isClassifyFailed: false,
      ocrText: "",
      isProgressOCR: false,
      inputurl: "",
      inputurlState: null,
      map: "",
      mapType: "roadmap",
      isCamOpen: false,  
    };
  },
  created() {
    if (this.getSelectId) this.loadNote();
    else this.initNote();
  },
  methods: {
    ...mapMutations(noteStore, {
      insertNote: "insertNote",
      deleteNote: "deleteNote",
      pinNote: "pinNote",
      setSelectNoteId: "setSelectNoteId",
    }),
    ...mapMutations(labelStore, {
      insertLabel: "insertLabel",
    }),
    initNote() {
      this.note = {
        uid: this.$uuid.v4(),
        title: "",
        theme: "#FFFFFF",
        text: "",
        author: "",
        createDate: this.$moment().format("YYYY-MM-DD HH:mm"),
        updateDate: "",
        alarm: "",
        pin: false,
        search: false,
        isLabeled: false,
        labels: [],
        place: "",
      };
      this.editText = "";
      this.isAlarmOpen = false;
      this.isMapOpen = false;
      this.isImageOCR = false;
      this.isMapOpen = false;
    },
    loadNote() {
      this.note = { ...this.getNote(this.getSelectId) };
      this.editText = this.note.text;
    },
    editNote() {
      this.note.updateDate = this.$moment().format("YYYY-MM-DD HH:mm");
      this.insertNote({ uid: this.note.uid, note: this.note });
      this.setSelectNoteId(this.note.uid);
      this.loadNote();
      this.$refs.textEditor.innerHTML = this.editText;
    },
    addAlarm() {
      this.note.alarm = this.alarmDate + " " + this.alarmTime.slice(0, -3);
    },
    deleteAlarm() {
      this.note.alarm = "";
      this.alarmDate = "";
      this.alarmTime = "";
    },
    changeTheme(e) {
      this.note.theme = e.target.value;
    },
    inputText(e) {
      this.note.text = e.target.innerHTML;
    },
    exec(command, value) {
      document.execCommand(command, false, value);
    },
    setPreview(input) {
      this.stopCam();
      if (input.target.files && input.target.files[0]) {
        if (input.target.files[0].type.match("image/")) {
          let fr = new FileReader();
          fr.onload = function () {
            let preview = document.getElementById("preview");
            preview.setAttribute("src", fr.result);
          };
          fr.readAsDataURL(input.target.files[0]);
        } else {
          console.log("Wrong type file");
        }
      }
    },
    initImage() {
      this.image = "";
      this.imageWidth = "";
      this.imageClass = "";
    },
    loadImage() {
      this.image = document.getElementById("preview").src;
      this.labeledImage();
    },
    async labeledImage() {
      const img = document.getElementById("preview");
      let res = await this.getModel.detect(img);
      if (res[0]) {
        this.imageClass = res[0].class;
        this.isClassifyFailed = false;
      } else {
        this.imageClass = "";
        this.isClassifyFailed = true;
      }
    },
    execUploadImage() {
      document.querySelector(".text-input").focus();
      if (this.image) {
        if (!this.imageWidth) this.imageWidth = "auto";
        //let wrapper = `<img src="${this.image}"><br>`;
        let wrapper = `<img src="${this.image}" width="${this.imageWidth}"><br>`;
        //console.log(wrapper);
        document.execCommand("insertHTML", false, wrapper);
        this.addClassifyLabel();
      }
    },
    addClassifyLabel() {
      if (this.imageClass) {
        const label = this.imageClass;
        this.insertLabel(label);
        this.note.labels.splice(this.note.labels.length, 0, label);
      }
    },
    initOCR() {
      this.ocrText = "";
    },
    loadOCR() {
      this.loadTesseract(document.getElementById("preview"));
    },
    execUploadText() {
      document.querySelector(".text-input").focus();
      if (this.ocrText) {
        document.execCommand("insertText", false, this.ocrText);
      }
    },
    loadTesseract(img) {
      const worker = createWorker({
        logger: (m) => console.log(m),
      });

      (async () => {
        this.isProgressOCR = true;
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(img);
        //console.log(text);
        this.ocrText = text;
        this.isProgressOCR = false;
        await worker.terminate();
      })();
    },
    exeInsertUrl() {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var result = regExp.exec(this.inputurl);

      //console.log(result);

      let wrapper =
        '<iframe width="auto" height="auto" src="https://www.youtube.com/embed/' +
        result[7] +
        '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></a><div><br></div>';

      document.querySelector(".text-input").focus();
      document.execCommand("insertHTML", false, wrapper);
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.inputurlState = valid;
      return valid;
    },
    resetModal() {
      this.inputurl = "";
      this.inputurlState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      this.exeInsertUrl();
      this.$nextTick(() => {
        this.$bvModal.hide("input-url-modal");
      });
    },
    initMap() {
      var container = document.getElementById("map");
      var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 2,
      };

      var _map = new kakao.maps.Map(container, options);
      _map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      this.map = _map;

      this.searchMap(this.note.place);
    },
    searchMap(searchPlace) {
      let search = searchPlace;
      if (!search) search = defaultPlace;

      let ps = new kakao.maps.services.Places();
      ps.keywordSearch(search, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          var bounds = new kakao.maps.LatLngBounds();

          for (var i = 0; i < data.length; i++) {
            this.displayMarker(data[i]);
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }

          this.map.setBounds(bounds);
        }
      });
    },
    mapOpen() {
      document.querySelector(".map-wrap").style.height = '20rem';
      this.isMapOpen = true;
    },
    mapToggle() {
      if(this.isMapOpen) {
        document.querySelector(".map-wrap").style.height = 0;
        this.isMapOpen = false;
      }
      else{
        this.mapOpen();
      }
    },
    mapTypeSwap() {
      if (this.mapType === "roadmap") {
          this.map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
          this.mapType = "hybrid";
      } else {
          this.map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
          this.mapType = "roadmap";
      }
    },
    mapZoomIn() {
      this.map.setLevel(this.map.getLevel() - 1);
    },
    mapZoomOut() {
      this.map.setLevel(this.map.getLevel() + 1);
    },
    displayMarker(place) {
      var infowindow = new kakao.maps.InfoWindow({
        content:
          '<div style="\
          max-width:160px; padding:5px; font-size:12px; \
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap; ">' +
          place.place_name +
          '</div>',
      });

      var marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x),
        title: place.place_name,
      });

      kakao.maps.event.addListener(marker, 'click', this.makeClickListener(marker));
      kakao.maps.event.addListener(marker, "mouseover", this.makeOverListener(this.map, marker, infowindow));
      kakao.maps.event.addListener(marker, "mouseout", this.makeOutListener(infowindow));
    },
    makeClickListener(marker) {
      return function () {
        //let latlng = marker.getPosition();
        //let kakaoMapURL = `https://map.kakao.com/link/map/${marker.getTitle()},${latlng.getLat()},${latlng.getLng()}`;
        let kakaoMapURL = `https://map.kakao.com/link/search/${marker.getTitle()}`;
        window.open(kakaoMapURL, '_blank');
      };
    },
    makeOverListener(map, marker, infowindow) {
      return function () {
        infowindow.open(map, marker);
      };
    },
    makeOutListener(infowindow) {
      return function () {
        infowindow.close();
      };
    },
    setCamPreview() {
      let preview = document.getElementById("preview");
      let cam = document.getElementById("cam");
      let canvas = document.getElementById("capture");
      let context = canvas.getContext("2d");
      context.drawImage(cam, 0, 0, 960, 720);
      preview.setAttribute("src", canvas.toDataURL());
    },
    toggleCam(){
      if (!this.isCamOpen) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
          .then(function(stream) {
            let cam = document.getElementById("cam");
            cam.srcObject = stream;
            cam.play();
          });
          this.isCamOpen = true;
        }
      }
      else {
        this.setCamPreview();
        this.stopCam();
      }
    },
    stopCam() {
      let cam = document.getElementById("cam");
      if (cam.srcObject && cam.srcObject.getTracks()[0]) {
        cam.pause();
        cam.srcObject.getTracks()[0].stop();
        cam.srcObject = null;
      }
      this.isCamOpen = false;
    },
  },
  computed: {
    ...mapGetters(noteStore, {
      getNote: "getNote",
      getIndex: "getIndex",
      getSelectId: "getSelectNoteId",
    }),
    ...mapGetters(labelStore, {
      getLabelList: "getLabelList",
      getLabel: "getLabel",
    }),
    ...mapGetters(AIStore, {
      getModel: "getModel",
    }),
    availableLabels() {
      return this.getLabelList.filter(
        (opt) => this.note.labels.indexOf(opt) === -1
      );
    },
    getAlarm: function () {
      return this.getSelectId
        ? this.getNote(this.getSelectId).alarm
        : this.note.alarm;
    },
    classifyFailed: function () {
      if (this.imageClass.length > 0) return false;
      return this.isClassifyFailed;
    },
    imageLabelState: function () {
      return this.classifyFailed ? false : true;
    },
    camButton: function() {
      if (!this.isCamOpen) return "웹캠 업로드";
      else return "웹캠 캡쳐";
    },
  },
  watch: {
    getSelectId: function () {
      if (this.getSelectId) this.loadNote();
      else this.initNote();
    },
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      script.onload = () => kakao.maps.load(this.initMap);
      script.type = "text/javascript";
      script.src = "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=f87518b22d74b31f18e1b412eaff2c32&libraries=services";
      document.head.appendChild(script);
    }
  },
};
</script>

<style scoped lang="scss">
@import "../styles/noteeditor.scss";
</style>
