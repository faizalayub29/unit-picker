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
            { id: 918, name: 'Hype Residence', path: 'hype_residence.svg' },
            { id: 98, name: 'Serasi Shops (HT6T1B)', path: 'serasi_shops.svg' },
            { id: 21, name: 'Casira 3 (Siri 3) (BBR2 - R10E)', path: 'casira_3.svg' },
            { id: 31, name: 'Nadira (Phase 1) (BBR2 - R1A2)', path: 'nadira_1.svg' },
            { id: 32, name: 'Serenia Industrial Park Phase 3 (SC - CU-1(b))', path: 'serenia_industrial.svg' },
            { id: 33, name: 'Serenia Anisa (Stage 3) (SC-A10 - 3)', path: 'serenia_anisa.svg' },
        ]
    }),
    methods: {
        onChoose: function({ value }){
            this.$emit('select', value.path);
        }
    },
    mounted: async function(){
        await helper.sleep(400);
        this.onChoose({ value: this.dataset[5] });
    }
}
</script>