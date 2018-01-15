<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <toolbar></toolbar>
      </md-app-toolbar>
      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'

import Toolbar from './components/Toolbar'

export default {
  computed: mapState({
    anonymousUser: state => state.anonymousUser
  }),
  watch: {
    anonymousUser: function (newValue) {
      if(newValue) {
        setTimeout(() => {this.$router.push('/login')}, 1000)
      } else {
        setTimeout(() => {this.$router.push('/')}, 1000)
      }
    }
    
  },
  components : {
    Toolbar
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; 
@include md-register-theme("default", (
  primary: md-get-palette-color(blue, A200)
));
@import "~vue-material/dist/theme/all";
</style>
