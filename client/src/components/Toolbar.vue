<template>
  <div class="md-toolbar-row">
    <div class="md-toolbar-section-start">
      <img class="dog" src="../assets/dogesmall.jpg" alt="dog">
      <span class="md-title">PIE-check</span>
    </div>
    <div class="md-toolbar-section-end">
      <md-button class="md-primary" type="submit" v-if="!anonymousUser" @click="logoutFrom">Logout</md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { LOGOUT } from '@/data/mutationTypes'

export default {
  computed: mapState({
    anonymousUser: state => state.anonymousUser
  }),
  methods: {
    ...mapActions([ LOGOUT ]),
    logoutFrom() {
      this[LOGOUT]()
    }
  }
}
</script>

<style lang="scss" scoped>
  .dog {width: 56px; border-radius: 50%; transition: transform 1s ease-out 0s;}
  .dog:hover {transform: rotate(360deg)}
  .md-title {line-height: 55px;}
</style>
