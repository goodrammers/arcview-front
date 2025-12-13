import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/pages/Dashboard.vue'
import MainLayout from '@/layout/MainLayout.vue'
import RealTime from '@/pages/real-time/RealTime.vue'
import Admin from '@/pages/Admin.vue'
import TaskManager from '@/pages/TaskManager/TaskManager.vue'
import JobDetail from '@/pages/JobDetail/JobDetail.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: MainLayout,
        redirect: '/dashboard',
        children: [
            { path: '/dashboard', component: Dashboard },
            { path: '/job-detail', component: JobDetail },
            { path: '/real-time', component: RealTime },
            { path: '/task', component: TaskManager },
            { path: '/admin', component: Admin },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
