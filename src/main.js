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
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import SelectButton from 'primevue/selectbutton';

import SelectProject from './components/select-project.vue';
import MapPicker from './components/map-picker.vue';

const app = createApp(App);

app.use(PrimeVue, { ripple: true });
app.use(ConfirmationService);
app.use(ToastService);

app.component('select-project', SelectProject);
app.component('map-picker', MapPicker);
app.component('Dropdown', Dropdown);
app.component('Card', Card);
app.component('Menu', Menu);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Button', Button);
app.component('Toast', Toast);
app.component('SelectButton', SelectButton);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Skeleton', Skeleton);
app.component('Dialog', Dialog);

app.mount('#app');
