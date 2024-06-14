


<template>
  <section class="layout_container m-0 py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <div class="audio_section p-3">
            <img src="/src/assets/logo.svg" alt="LAPD" class="LAPD_logo">
            <div class="LAPD_name">
              <h3>Los <br> Angeles <br>
              Police<br>
            Department</h3>
            </div>
            <img src="/src/assets/js/mic.svg" alt="LAPD" class="Mic">
            
            <div class="row">
              <div class="col-lg-12">
                <div class="text-center">
                  <div class="audio_icon my-5 pt-5">
                    <font-awesome-icon icon="fa-solid fa-microphone" />
                  </div>

                  <button type="button" @click="startRecording" :disabled="isRecording" class="btn start_btn mb-4">Start Recording</button>
                  <button type="button" @click="stopRecording" :disabled="!isRecording" class="btn start_btn mb-4">Stop Recording</button>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="chat_section p-3">
            <div class="row mb-5">
              <div class="col-lg-12">
                <div class="chat_section_header">
                  <a>
                    <img class="exc me-4" src="/src/assets/images/exc_icon.svg" alt="Alert">
                  </a>
                  <a>
                    <img class="exc me-4" src="/src/assets/images/delete_icon.svg" alt="Delete">
                  </a>
                  
                  <div class="search_box">
                    <input type="text" class="form-control" placeholder="Search" aria-describedby="emailHelp" />
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon" />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <div class="chat_box">
                  <div class="row">
                    <div class="col-lg-12">
                      
                     
                      <div class="user_chat d-flex align-items-star mb-4">
                        <div class="img-box">
                          <img src="/src/assets/images/user-chat.png" alt="User">
                        </div>
                        
                        <div class="chat_text_div" v-if="transcription">
                          <p>Language detected: {{detectedlanguage}} </p>
                          <p> <b>{{detectedlanguage}} : </b>{{transcription}} </p>
                         <p> <b>English : </b>{{translatedtext}}</p>
                        </div>

                        <div class="chat_text_div" v-if="processing">
                          <p> Processing.... </p>
                          </div>


                      </div>
                 
                      <div v-if="openai" class="lapd_chat d-flex align-items-start justify-content-end mb-4">
                        <div class="chat_text_div d-flex flex-column align-items-end">
                          <p v-if="openairesponse[0]">{{openairesponse[0]}}</p>
                          <!-- <p v-if="openairesponse[1]">{{openairesponse[1]}}</p> -->
                          <p v-if="openairesponse[1]">{{openairesponse[1]}}
                            <br>
                            <div class="float-end sound_box" v-if="convertedtext">
                              <span style="margin-right: 10px;">
                                <font-awesome-icon icon="fa-solid fa-play"  @click="playAudio(convertedtext)" />
                              </span>
                              <span style="margin-right: 10px;">
                                <font-awesome-icon icon="fa-solid fa-pause" @click="pauseAudio(convertedtext)"/>
                              </span>
                              <!-- <span>
                                <font-awesome-icon icon="fa-solid fa-play" v-if="play2" @click="pauseAudio(convertedtext)" />
                              </span> -->
                              <span>
                                <font-awesome-icon icon="fa-solid fa-rotate-right" @click="stopAudio(convertedtext)" />
                              </span>
                            </div>
                          </p> 
                        

                        </div>
                        <div class="img-box">
                          <img src="/src/assets/images/lapd_chat.png" alt="LAPD">
                        </div>
                      </div>
                   
                    </div>
                    
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>

</style>


<script>
import axios from 'axios';
import { COMMON_API_HTTP } from './api/axiosConfig';
import { withDirectives } from 'vue';


export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      transcription: '',
      translatedtext:'',
      openai:'',
      detectedlanguage:'',
      processing:false,
      convertedtext:'',
      isPaused: false,
      speechSynthesisUtterance: null,
      play:true,
      pause:false,
      play2:false
    };
  },
  methods: {

clearFields(){
      this.transcription= ''
      this.translatedtext=''
      this.openai=''
      this.detectedlanguage=''
      this.processing=false
      this.convertedtext=''
      this.speechSynthesisUtterance= null


},

    async startRecording() {

      this.clearFields()

      try {
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioChunks = [];
          this.uploadRecording()
        };

        this.isRecording = true;
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    },
    stopRecording() {
      this.processing=true   
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        this.isRecording = false;
       

      }
    },



    async uploadRecording() {
      if (!this.audioBlob) return;

      const formData = new FormData();
      formData.append('file', this.audioBlob, 'audio.wav');

      try {
        const response = await COMMON_API_HTTP.post('/transcribe/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.processing=false
        console.log(response)
        this.transcription = response.data.transcription;
        this.translatedtext = response.data.translatedtext;
        this.openai = response.data.openai;
        this.detectedlanguage=response.data.detectedlanguage;
        this.convertedtext=response.data.convertedtext

        console.log(this.openai)
        this.openairesponse = this.openai.split('\n\n')
        console.log(this.openairesponse)

      } catch (error) {
        this.processing=false
        console.error('Error uploading audio file.', error);
      }
    },


    async playAudio(text) {
      if (!text) {
        console.log('Please enter some text');
        return;
      }

      if (this.isPaused && this.speechSynthesisUtterance) {
            window.speechSynthesis.resume();
            this.isPaused = false;
            return;
          }
          this.play=false
          this.pause=true;

      const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(audioBlob);
      };

      mediaRecorder.start();
      window.speechSynthesis.speak(speechSynthesisUtterance);

      speechSynthesisUtterance.onend = () => {
        mediaRecorder.stop();
      };
    },


    pauseAudio() {
     
          if (window.speechSynthesis.speaking && !this.isPaused) {
            window.speechSynthesis.pause();
            this.play2=true
            this.pause=false

            this.isPaused = true;
          } else if (this.isPaused) {
            window.speechSynthesis.resume();
            this.isPaused = false;
            this.play2=false
            this.pause=true 
          }
          this.play=true
          this.pause=false 
          this.play2=false
        },

        stopAudio() {
          window.speechSynthesis.cancel();
          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
          }
          this.isPaused = false;
        }


  }
};
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
