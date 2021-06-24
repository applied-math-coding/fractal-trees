import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import Checkbox from 'primevue/checkbox';
import ProgressBar from 'primevue/progressbar';


const app = createApp(App);
app.use(PrimeVue);
app.component('Button', Button);
app.component('InputNumber', InputNumber);
app.component('Slider', Slider);
app.component('Checkbox', Checkbox);
app.component('ProgressBar', ProgressBar);
app.mount('#app');
