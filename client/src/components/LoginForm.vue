<template>
  <div>
    <form novalidate @submit.prevent="validate">
        <md-field :class="getValidationClass('ldap')">
          <label>LDAP</label>
          <md-input v-model="form.ldap"></md-input>
          <span class="md-error" v-if="!$v.form.ldap.required">LDAP is required</span>
        </md-field>
        <md-field :class="getValidationClass('pass')">
          <label>Password</label>
          <md-input v-model="form.pass"></md-input>
          <span class="md-error" v-if="!$v.form.pass.required">The password is required</span>
        </md-field>
        <md-button class="md-primary" type="submit">Login</md-button>
    </form>
    <md-snackbar md-position="center" :md-active.sync="error.hasError" :md-duration="error.duration" md-persistent>
      <span>{{ error.text }}</span>
    </md-snackbar>
  </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'

import { LOGIN } from '@/data/mutationTypes'

export default {
  mixins: [validationMixin],
  data: () => ({
    form: {
      ldap: null,
      pass: null
    },
    error: {
      hasError: false,
      duration: 3000,
      text: ''
    }
  }),
  validations: {
    form: {
      ldap: {
        required
      },
      pass: {
        required
      }
    }
  },
  computed: mapState({
    anonymousUser: state => state.anonymousUser
  }),
  methods: {
    ...mapActions([ LOGIN ]),
    handleSubmit () {
      this[LOGIN]({ pass: this.form.pass })
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
    anonymousUser: function (newValue) {
      if (newValue instanceof Error) {
        this.error =  {
          hasError: true,
          text: newValue.response.statusText
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
