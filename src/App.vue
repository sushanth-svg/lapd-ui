<!-- src/components/AudioRecorder.vue -->
<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">Start Recording</button>
    <button @click="stopRecording" :disabled="!isRecording">Stop Recording</button>
    <button @click="uploadRecording" :disabled="!audioBlob">Upload Recording</button>
    <p v-if="transcription">Transcription: {{ transcription }}</p>
    <p v-if="translatedtext">Translated: {{ translatedtext }}</p>
    <p v-if="openai">OpenAI: {{ openai }}</p>
    <p v-if="lang">Language: {{ lang }}</p>

  </div>
</template>

<script>
import axios from 'axios';

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
    };
  },
  methods: {
    async startRecording() {
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
        };

        this.isRecording = true;
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    },
    stopRecording() {
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
        const response = await axios.post('http://localhost:8000/transcribe/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response)
        this.transcription = response.data.transcription;
        this.translatedtext = response.data.translatedtext;
        this.openai = response.data.openai;
        this.lang=response.lang
      } catch (error) {
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
