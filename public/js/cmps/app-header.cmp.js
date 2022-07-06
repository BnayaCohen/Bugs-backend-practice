'use strict'

import { userService } from '../services/user-service.js'

export default {
  template: `
        <header>
            <h1>Miss Bug</h1>  
            <div class="actions">
              <router-link to="/bug">Bugs </router-link>  
              <router-link :to="'/user/'+currUserId">User page</router-link>  
              <button @click="logout">Log out</button>
            </div> 
          </header>
    `,
  components: {
  },
  data() {
    return {
      // user: null,
    }
  },
  methods: {
    logout() {
      userService.logout()
        .then(() => {
          // this.user = null
          this.$router.push('/login')
        })
        .catch(err => {
          console.log('Cannot logout', err)
        })
    }
  },
  computed: {
    currUserId() {
     return userService.getLoggedInUser()._id
    }
  },
  created() {
    // this.user = userService.getLoggedInUser()
  }
}
