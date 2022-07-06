import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import loginSignup from '../pages/login-signup.cmp.js'
import userDetails from '../pages/user-details.cmp.js'
import userList from '../cmps/user-list.cmp.js'

const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/login', component: loginSignup },
  { path: '/user/:userId', component: userDetails },
  { path: '/user', component: userList },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
