<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <img class="dog" src="./assets/dogesmall.jpg" alt="dog">
        <span class="md-title">PIE-check</span>
      </md-app-toolbar>
      <md-app-content>
        <form novalidate @submit.prevent="validate">
            <md-field :class="getValidationClass('reviews')">
              <label>Reviews report</label>
              <md-file v-model="form.reviews" ref='reviewsReport' accept=".csv" />
              <span class="md-error" v-if="!$v.form.reviews.required">The report is required and should be in .csv format</span>
            </md-field>
            <md-field :class="getValidationClass('purchases')">
              <label>Purchases report</label>
              <md-file v-model="form.purchases" ref='purchasesReport' accept=".csv" />
              <span class="md-error" v-if="!$v.form.purchases.required">The report is required and should be in .csv format</span>
            </md-field>
            <md-button class="md-primary" type="submit">Submit</md-button>
        </form>
      <md-bottom-bar class="disclaimer">Use of this form assumes that you have two reports: reviews report and purchases report. Copy the necessary cells from reports and insert them to the respective fields. The values should be separated by a new line. When the form is filled, click "Calculate" and "Copy". The output will be copied to the buffer and you will be able to insert it to the spreadsheet column
      </md-bottom-bar>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'
export default {
  mixins: [validationMixin],
  data: () => ({
    form: {
      reviews: null,
      purchases: null
    }
  }),
  validations: {
    form: {
      reviews: {
        required
      },
      purchases: {
        required
      }
    }
  },
  methods: {
    handleSubmit () {
      const formData = new FormData()
      const reviewsReportFile = this.getFileByRef('reviewsReport')
      const purchasesReportFile = this.getFileByRef('purchasesReport')
      formData.append('reviews', reviewsReportFile)
      formData.append('purchases', purchasesReportFile)
      axios.post('/api/upload', formData, { headers: {'Content-Type': 'multipart/form-data'} })
        .then((res) => {
          window.open(res.data.path)
        })
    },
    getFileByRef(inputName) {
      return this.$refs[inputName].$el.querySelector('input[type=file]').files[0]
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validate() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.handleSubmit()
      }
    }
  }
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
.disclaimer {padding: 10px;}
</style>
