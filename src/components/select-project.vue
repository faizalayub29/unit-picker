<template>
    <Dropdown
        v-model="selected"
        :options="dataset"
        optionLabel="name"
        placeholder="Nothing Selected"
        class="w-full"
        :pt="{
            root: 'border-none',
            trigger: 'hidden',
            input: 'tool-dropdown-size surface-200 border-round border-1 border-300 text-600 hover:text-blue-500 hover:border-blue-300 cursor-pointer'
        }"
        @change="onChoose">
    </Dropdown>
</template>

<script>
import * as helper from '../utils';

export default {
    name: 'SelectProject',
    emits: ['select'],
    data: () => ({
        selected: null,
        dataset: [
            { id: 918, name: 'Hype Residence', path: '../src/assets/svg/hype_residence.svg' },
            { id: 98, name: 'Serasi Shops (HT6T1B)', path: '../src/assets/svg/serasi_shops.svg' },
            { id: 21, name: 'Casira 3 (Siri 3) (BBR2 - R10E)', path: '../src/assets/svg/casira_3.svg' },
            { id: 31, name: 'Nadira (Phase 1) (BBR2 - R1A2)', path: '../src/assets/svg/nadira_1.svg' },
        ]
    }),
    methods: {
        onChoose: function({ value }){
            this.$emit('select', value.path);
        }
    },
    mounted: async function(){
        await helper.sleep(400);
        this.onChoose({ value: this.dataset[3] });
    }
}
</script>