import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';


const app = createApp(App);
app.use(PrimeVue);
app.component('Button', Button);
app.component('InputNumber', InputNumber);
app.component('Slider', Slider);
app.mount('#app');
