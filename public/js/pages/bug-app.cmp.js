'use strict'
import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user-service.js'
import { eventBus } from '../services/eventBus-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
    <router-link v-if="user?.isAdmin" to="/user">Admin page</router-link>
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
      user: null,
      bugs: null,
      filterBy: {
        txt: '',
        pageIdx: 0,
      },
    }
  },
  created() {
    this.user = userService.getLoggedInUser()

    if (!this.user) {
      this.$router.push('/login')
      return
    }

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
    logout() {
      userService.logout()
        .then(() => {
          this.user = null
          this.$router.push('/login')
        })
        .catch(err => {
          console.log('Cannot logout', err)
        })
    }
  },
  computed: {
  },
  components: {
    bugList,
    bugFilter,
  },
}
