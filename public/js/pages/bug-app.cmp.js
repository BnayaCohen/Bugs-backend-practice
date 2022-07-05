'use strict'
import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user-service.js'
import { eventBus } from '../services/eventBus-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
      <button @click="logOut">Log out</button>
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <button @click="onSetPage(-1)">Prev</button>
        <span>{{filterBy.pageIdx + 1}}</span>
        <button @click="onSetPage(1)">Next</button>
    </section>
    `,
  data() {
    return {
      isLoggedIn: false,
      bugs: null,
      filterBy: {
        txt: '',
        pageIdx: 0,
      },
    }
  },
  created() {
    this.isLoggedIn = userService.getLoggedInUser() ? true : false

    if (!this.isLoggedIn) this.$router.push('/login')

    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then((bugsAndFilter) => {
        this.bugs = bugsAndFilter.bugs
        this.filterBy = bugsAndFilter.filterBy
        console.log(this.bugs);
      })
    },
    setFilterBy(filterBy) {
      this.filterBy.txt = filterBy.txt
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId)
        .then(() => this.loadBugs())
        .catch(() => {
          eventBus.emit('show-msg', { txt: 'Only the bug creator can remove', type: 'error' })
        })
    },
    onSetPage(dir) {
      this.filterBy.pageIdx += dir;
      this.loadBugs()
    },
    logOut() {
      userService.logOut()
        .then(() => this.$router.push('/login'))
    }
  },
  computed: {
  },
  components: {
    bugList,
    bugFilter,
  },
}
