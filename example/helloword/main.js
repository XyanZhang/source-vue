// vue3 
import { App } from './App.js';
import { createApp } from '../.././lib/guide-vue.esm.js'

const rootContainer = document.querySelector('#app');
createApp(App).mount(rootContainer)