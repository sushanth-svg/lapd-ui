<!-- src/components/AudioRecorder.vue -->
<!-- <template>
  <div>
    <button @click="startRecording" :disabled="isRecording">Start Recording</button>
    <button @click="stopRecording" :disabled="!isRecording">Stop Recording</button>
    <button @click="uploadRecording" :disabled="!audioBlob">Upload Recording</button>
    <p>Spoken language: {{ transcription }}</p>
    <p>Translated in english: {{ translatedtext }}</p>
    <p>Detected language: {{ language }}</p>
    <p>OpenAI: {{ openai }}</p>
      

  </div>
</template> -->


<template>
  <section class="layout_container m-0 py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <div class="audio_section p-3">
            <div class="row">
              <div class="col-lg-12">
                <!-- Audio section start here -->
                <div class="text-center">
                  <div class="audio_icon my-5 pt-5">
                    <font-awesome-icon icon="fa-solid fa-microphone" />
                  </div>

                  <button type="button" @click="startRecording" :disabled="isRecording" class="btn start_btn mb-4">Start Recording</button>
                  <button type="button" @click="stopRecording" :disabled="!isRecording" class="btn start_btn mb-4">Stop Recording</button>

                </div>
                <!-- Audio section end here -->
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
                    <!-- <font-awesome-icon class="exc me-4" icon="fa-solid fa-triangle-exclamation" /> -->
                    <img class="exc me-4" src="/src/assets/images/exc_icon.svg" alt="Alert">
                  </a>
                  <a>
                    <!-- <font-awesome-icon class="delete me-4" icon="fa-solid fa-trash" /> -->
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
                      
                      <!-- User chat div start here -->
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
                      <!-- User chat div end here -->

                    


                      <!-- Lapd chat div start here -->
                      <div v-if="openai" class="lapd_chat d-flex align-items-start justify-content-end mb-4">
                        <div class="chat_text_div d-flex flex-column align-items-end">
                          <p v-if="openairesponse[0]">{{openairesponse[0]}}</p>
                          <p v-if="openairesponse[1]">{{openairesponse[1]}}</p>
                          <p v-if="openairesponse[2]">{{openairesponse[2]}}</p>

                        </div>
                        <div class="img-box">
                          <img src="/src/assets/images/lapd_chat.png" alt="LAPD">
                        </div>
                      </div>
                      <!-- Lapd chat div end here -->

                      <!-- User chat div start here -->
                      <!-- <div class="user_chat d-flex align-items-star mb-4">
                        <div class="img-box">
                          <img src="/src/assets/images/user-chat.png" alt="User">
                        </div>
                        <div class="chat_text_div">
                          <p>Lorem ipsum </p>
                        </div>
                      </div> -->
                      <!-- User chat div end here -->

                      <!-- Lapd chat div start here -->
                      <!-- <div class="lapd_chat d-flex align-items-start justify-content-end mb-4">
                        <div class="chat_text_div d-flex flex-column align-items-end">
                          <p>Lorem ipsum </p>
                        </div>
                        <div class="img-box">
                          <img src="/src/assets/images/lapd_chat.png" alt="LAPD">
                        </div>
                      </div> -->
                      <!-- Lapd chat div end here -->

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

<!-- <script>
export default {
 
};
</script> -->

<style scoped>

</style>


<script>
import axios from 'axios';
import { COMMON_API_HTTP } from './api/axiosConfig';


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
     
    };
  },
  methods: {

clearFields(){
      this.transcription= ''
      this.translatedtext=''
      this.openai=''
      this.detectedlanguage=''
      this.processing=false
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
        this.detectedlanguage=response.data.detectedlanguage

        console.log(this.openai)
        this.openairesponse = this.openai.split('\n\n')
        console.log(this.openairesponse)

      } catch (error) {
        this.processing=false
        console.error('Error uploading audio file.', error);
      }
    }
  }
};
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
