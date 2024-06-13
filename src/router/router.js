import { createRouter, createWebHistory } from 'vue-router'


import LAPD from '../../src/views/LAPD.vue';


const routes =[ 

  // {
  //   path: '/signin',
  //   name: 'signin',
  // 	component :SignIn,
  // },
  
  {
    path: '/LAPD',
    name: 'LAPD',
    component: LAPD,
  },
  
  
]
const router = createRouter({

  history:createWebHistory(),
  routes
})
export default router