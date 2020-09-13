import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$Http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
