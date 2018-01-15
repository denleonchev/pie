<template>
  <div>
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
    <md-snackbar md-position="center" :md-active.sync="error.hasError"  :md-duration="error.duration" md-persistent>
      <span>{{ error.text }}</span>
    </md-snackbar>
    <md-bottom-bar class="disclaimer">Use of this form assumes that you have two reports: reviews report and purchases report. The columns "Product ID" and "Emails" must be named. Save the reports as CSV files and upload them. A link to the updated report will be opened in the new window.
    </md-bottom-bar>
  </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'

import Toolbar from './Toolbar'
import { UPLOAD, LOGOUT } from '@/data/mutationTypes'

export default {
  mixins: [validationMixin],
  data: () => ({
    form: {
      reviews: null,
      purchases: null
    },
    error: {
      hasError: false,
      duration: 3000,
      text: ''
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
  computed: mapState({
    path: state => state.path
  }),
  methods: {
    ...mapActions([ UPLOAD, LOGOUT ]),
    handleSubmit () {
      const formData = new FormData()
      const reviewsReportFile = this.getFileByRef('reviewsReport')
      const purchasesReportFile = this.getFileByRef('purchasesReport')
      formData.append('reviews', reviewsReportFile)
      formData.append('purchases', purchasesReportFile)
      this[UPLOAD](formData)
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
  },
  watch: {
    path: function (newValue, prevValue) {
      if (newValue instanceof Error) {
        this.error =  {
          hasError: true,
          text: newValue.response.statusText
        }
        if(newValue.message.indexOf('401') > -1) {
          this[LOGOUT]()
        }
        return
      }
      if (newValue !== prevValue) {
        this.error = {
          hasError: false,
          text: ''
        }
        window.open(newValue)
      }
    }
  },
  components : {
    Toolbar
  }
}
</script>

<style lang="scss" scoped>
.md-card {margin-bottom: 20px;}
button {line-height: 26px;}
.md-bottom-bar {margin-top: 50px;}
.disclaimer {padding: 10px;}
</style>
