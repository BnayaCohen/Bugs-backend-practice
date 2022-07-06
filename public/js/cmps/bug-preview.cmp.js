'use strict'

export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <router-link :to="'/user/'+bug.creator._id">
                  Creator: {{bug.creator.username}}</router-link>  
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <h4>{{bug.description}}</h4>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button @click="onRemove(bug._id)">X</button>
              </article>`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
  },
}
