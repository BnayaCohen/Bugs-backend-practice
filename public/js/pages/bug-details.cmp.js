'use strict'
import { eventBus } from '../services/eventBus-service.js'
import { bugService } from '../services/bug-service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <h3>Creator: {{bug.creator.nickname}}</h3>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <h3>{{bug.description}}</h3>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
      }).catch(() => {
        eventBus.emit('show-msg', { txt: 'You cant watch more than 3 bugs in 7 seconds ', type: 'error' })
        this.$router.push('/bug')
      })
    }
  },
}
