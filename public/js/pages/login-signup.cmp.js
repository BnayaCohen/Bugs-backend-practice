import { userService } from '../services/user-service.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  template: `<section className="bug-login">
      <form  @submit.prevent="login">
        <h2>Login</h2>
        <input type="text" v-model="credentials.username" placeholder="Username" />
        <input type="password" v-model="credentials.password" placeholder="Password" />
        <button>Login</button>
      </form>
        <hr />
      <form  @submit.prevent="signup">
        <h2>Signup</h2>
        <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
        <input type="text" v-model="signupInfo.username" placeholder="Username" />
        <input type="password" v-model="signupInfo.password" placeholder="Password" />
        <button>Signup</button>
      </form>
            </section>`,
  data() {
    return {
      user: null,
      credentials: {
        username: 'puki',
        password: '123'
      },
      signupInfo: {
        fullname: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      userService.login(this.credentials)
        .then(user => {
          this.user = user
          this.$router.push('/bug')
          eventBus.emit('show-msg', { txt: `Welcome ${user.fullname}`, type: 'success' })
        })
        .catch(err => {
          eventBus.emit('show-msg', { txt: 'Invalid password or username', type: 'error' })
          console.log('Cannot login', err)
        })
    },
    signup() {
      userService.signup(this.signupInfo)
        .then(user => {
          this.user = user
          this.$router.push('/bug')
        })
        .catch(err => {
          console.log('Cannot signup', err)
        })
    },
  },
  created() {
    this.user = userService.getLoggedInUser()
    if (this.user) this.$router.push('/bug')
  }
}
