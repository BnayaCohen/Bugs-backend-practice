'use strict'

export default {
  template: `
        <section class="bug-filter">
            <span>Filter by text: </span>
            <input @input="setFilterBy" type="text" v-model="filterBy.txt">
        </section>
    `,
  data() {
    return {
      filterBy: {
        txt: '',
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}
