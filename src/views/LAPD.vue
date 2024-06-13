<template>
  <div class="container">
    <h1>Speech to Text Converter</h1>
    <button @click="startRecording">Start Recording</button>
    <p id="status">{{ status }}</p>
    <form @submit.prevent="submitText">
      <input type="hidden" v-model="text" name="text" />
      <input type="submit" value="Submit" />
    </form>
    <p>Converted Text: {{ text }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { COMMON_API_HTTP } from '../api/axiosConfig';


export default {
  data() {
    return {
      status: "",
      text: "",
    };
  },
  methods: {
    async startRecording() {
      this.status = "Recording...";
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", async () => {
          const audioBlob = new Blob(audioChunks);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64String = reader.result.split(",")[1];
            const response = await axios.post("http://127.0.0.1:8000/convert", { audio_data: base64String });
            this.text = response.data.text;
            this.status = "Recording completed";
          };
        });

        mediaRecorder.start();

        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Record for 5 seconds
      } catch (error) {
        this.status = "Recording failed: " + error.message;
      }
    },
    async submitText() {
      const response = await axios.post("http://127.0.0.1:8000/process", { text: this.text });
      alert(response.data.message);
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 50px;
}
</style>
