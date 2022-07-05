import { userService } from '../services/user-service.js'

export default {
  template: `<section className="bug-login">
            <form v-if="!isLoggedIn" @submit.prevent="logIn">
                <input type="text" v-model="nickname" placeholder="Enter nickname.." required>
                <button>Log In</button>
            </form>
            <button v-else @click="logOut">Log Out</button>
                </section>`,
  data() {
    return {
      nickname: '',
      isLoggedIn: false,
    }
  },
  methods: {
    logIn() {
      userService.logIn(this.nickname)
        .then(() => {
          this.isLoggedIn = true
          this.$router.push('/bug')
        })
    },
    logOut() {
      userService.logOut()
      this.isLoggedIn = false
    }
  },
  created() {
    this.nickname = userService.getLoggedInUser()
    this.isLoggedIn = this.nickname ? true : false
    if (this.isLoggedIn) this.$router.push('/bug')
  }
}
