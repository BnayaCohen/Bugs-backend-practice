'use strict'

import { userService } from '../services/user-service.js'

export default {
  props: ['user'],
  template: `<article class="user-preview">                
            <h4>Username: {{user.username}}</h4>
            <h5>Fullname: {{user.fullname}}</h5>
            <h5>balance: {{user.balance}}</h5>
            <!-- <router-link :to="'/user/' + user._id">Details</router-link> -->
            <button v-if="loggedInUser.isAdmin" @click="onRemove(user._id)">X</button>
            </article>`,
  data() {
      return {
          loggedInUser: null,
      }
  },
  methods: {
    onRemove(userId) {
      this.$emit('userRemoved', userId)
    },
  },
  created(){
  this.loggedInUser=  userService.getLoggedInUser()
  }
}
