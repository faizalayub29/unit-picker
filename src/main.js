import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';
import ConfirmDialog from 'primevue/confirmdialog';
import Skeleton from 'primevue/skeleton';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import SelectButton from 'primevue/selectbutton';

import MapPicker from './components/map-picker.vue';
import MapTools from './components/map-tools.vue';

import Casira3 from './assets/svg/casira_3.svg';
import Nadira1 from './assets/svg/nadira_1.svg';
import SerasiShop from './assets/svg/serasi_shops.svg';
import SereniaAnisa from './assets/svg/serenia_anisa.svg';
import SereniaIndustrial from './assets/svg/serenia_industrial.svg';
import HypeResidence from './assets/svg/hype_residence.svg';

const app = createApp(App);

app.use(PrimeVue, { ripple: true });
app.use(ConfirmationService);
app.use(ToastService);

app.component('Casira3', Casira3);
app.component('Nadira1', Nadira1);
app.component('SerasiShop', SerasiShop);
app.component('SereniaAnisa', SereniaAnisa);
app.component('SereniaIndustrial', SereniaIndustrial);
app.component('HypeResidence', HypeResidence);

app.component('map-picker', MapPicker);
app.component('map-tools', MapTools);

app.component('Dropdown', Dropdown);
app.component('Card', Card);
app.component('Menu', Menu);
app.component('Divider', Divider);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Button', Button);
app.component('Toast', Toast);
app.component('SelectButton', SelectButton);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Skeleton', Skeleton);
app.component('Dialog', Dialog);

app.mount('#app');
