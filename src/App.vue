<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <img class="dog" src="./assets/dogesmall.jpg" alt="dog">
        <span class="md-title">PIE-check</span>
      </md-app-toolbar>
      <md-app-content>
        <form novalidate method="POST" action="/api" enctype="multipart/form-data">
         <md-field>
          <label>Single</label>
          
        </md-field>
              <md-field>
                <label>Single</label>
                <input type="file" name="single">
                <input type="text" name="one">
              </md-field>
              <md-button class="md-primary" type="submit">Primary</md-button>
        </form>
      <md-bottom-bar>Use of this form assumes that you have two reports: reviews report and purchases report. Copy the necessary cells from reports and insert them to the respective fields. The values should be separated by a new line. When the form is filled, click "Calculate" and "Copy". The output will be copied to the buffer and you will be able to insert it to the spreadsheet column
      </md-bottom-bar>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
/*
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators' */
export default {
    data: () => ({
    single: null
  })
}
</script>

<style lang="scss" scoped>
@import "~vue-material/dist/theme/engine"; 
@include md-register-theme("default", (
  primary: md-get-palette-color(blue, A200)
));
@import "~vue-material/dist/theme/all";

.md-card {margin-bottom: 20px;}
.dog {width: 56px; border-radius: 50%; transition: transform 1s ease-out 0s;}
  .dog:hover {transform: rotate(360deg)}
button {line-height: 26px;}
.md-bottom-bar {margin-top: 50px;}
</style>
