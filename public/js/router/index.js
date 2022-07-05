import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import bugLogin from '../pages/bug-login.cmp.js'

const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/login', component: bugLogin },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
