'use strict'

import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import userPreview from '../cmps/user-preview.cmp.js'

export default {
    template: `<article v-if="userToShow" class="user-details">                
            <user-preview :user="userToShow"/>
            <h4>User Bugs</h4>
            <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
            <button @click="onSetPage(-1)">Prev</button>
            <span>{{filterBy.pageIdx + 1}}</span>
            <button @click="onSetPage(1)">Next</button>
              </article>`,
    data() {
        return {
            loggedInUser: null,
            userToShow: null,
            bugs: null,
            filterBy: {
                userId: '',
                pageIdx: 0,
            },
        }
    },
    methods: {
        loadBugs() {
            bugService.query(this.filterBy).then((bugsAndFilter) => {
                this.bugs = bugsAndFilter.bugs
                this.filterBy = bugsAndFilter.filterBy
            })
        },
        onRemove(bugId) {
            this.$emit('removeBug', bugId)
        },
        removeBug(bugId) {
            bugService.remove(bugId)
                .then(() => this.loadBugs())
        },
        onSetPage(dir) {
            this.filterBy.pageIdx += dir;
            this.loadBugs()
        },
    },
    created() {
        const { userId } = this.$route.params
        if (userId) {
            userService.getById(userId).then((user) => {
                this.userToShow = user
                this.filterBy.userId = this.userToShow._id
                this.loadBugs()
            }).catch(() => {
                eventBus.emit('show-msg', { txt: 'cannot get user', type: 'error' })
                this.$router.push('/bug')
            })
        }
        this.loggedInUser = userService.getLoggedInUser()
        if (!this.loggedInUser) {
            this.$router.push('/login')
            return
        }
    },
    computed: {
    },
    components: {
        bugList,
        userPreview
    },
}