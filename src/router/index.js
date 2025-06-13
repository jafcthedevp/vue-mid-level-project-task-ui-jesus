import { createRouter, createWebHistory } from 'vue-router';
import ProjectList from '../views/ProjectsList.vue';
import TaskList from '../views/TaskList.vue';

const routes = [
  {
    path: '/',
    name: 'Projects',
    component: ProjectList,
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TaskList,
  },
  {
    path: '/projects/:projectId/tasks',
    name: 'TaskList',
    component: TaskList,
    props: true, // Pass route params as props to the component
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;