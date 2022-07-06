'use strict'

import userPreview from './user-preview.cmp.js'
import { userService } from '../services/user-service.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  template: `
    <section v-if="users?.length" class="user-list">                    
      <user-preview v-for="user in users" :user="user" :key="user._id" @userRemoved="removeUser" />
    </section>
    <section v-else class="user-list">No users!</section>
    `,
  data() {
    return {
      users: null,
    }
  },
  methods: {
    loadUsers() {
      userService.query().then((users) => {
        this.users = users
        console.log(this.users)
      })
    },
    removeUser(userId) {
      userService.remove(userId)
      .then(()=>this.loadUsers())
      .catch(err=>
        eventBus.emit('show-msg', { txt: 'The user own bugs', type: 'error' })
        )
      
    }
  },
  components: {
    userPreview,
  },
  created() {
    const loggedInUser = userService.getLoggedInUser()

    if (!loggedInUser || !loggedInUser.isAdmin) {
      this.$router.push('/bug')
      return
    }
    this.loadUsers()
  }
}
