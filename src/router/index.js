import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/components/Home'
import Landing from '@/components/Landing'
import NotFound from '@/components/NotFound'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import EnrollGroup from '@/components/EnrollGroup'
import ForgotPassword from '@/components/ForgotPassword'
import CreateGroup from '@/components/CreateGroup'
import Sidebar from '@/components/Sidebar'
import Groups from '@/components/Groups'
import CreateSchedule from '@/components/CreateSchedule'
import MainSchedulee from '@/components/MainSchedule'

Vue.use(Router)

const AuthGuard = (to, from, next) => {
    if (firebase.auth().currentUser) {
        next()
    } else {
        next('/signin')
    }
}

// export default router
export default new Router({
    routes: [
        {
            path : '/forgotpassword',
            name : 'ForgotPassword',
            component : ForgotPassword
        },
        {
            path: '/',
            name: 'Landing',
            component: Landing,
            beforeEnter: AuthGuard
        },
        {
            path: '/signin',
            name: 'Signin',
            component: Signin
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            beforeEnter: AuthGuard
        },
        {
            path: '/enroll',
            name: 'Enroll',
            component: EnrollGroup,
            beforeEnter: AuthGuard
        },
        {
            path: '/create',
            name: 'Create Group',
            component: CreateGroup,
            beforeEnter: AuthGuard
        },

        {
            path: '/sidebar',
            name: 'Sidebar',
            component: Sidebar,
            beforeEnter: AuthGuard
        },
        {
            path: '/groups/:groupId',
            name: 'Groups',
            component: Groups,
            beforeEnter: AuthGuard
        },
        {
            path: '*',
            name: 'NotFound',
            component: NotFound
        },
        {
            path: '/create-schedule',
            name: 'createSchedule',
            component: CreateSchedule,
            beforeEnter: AuthGuard
        },
        {
            path: '/groups/:groupId/events',
            name: 'MainSchedule',
            component: MainSchedulee
        }
    ],
    mode: 'history'
})
