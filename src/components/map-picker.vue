<template>
    <div :class="['surface-0 h-full w-full sdp-canvas-base flex flex-column align-items-center justify-content-center border-1 border-300 border-round', {
        'active-mode': (keybind != null)
    }]">
        <div
            ref="base"
            class="flex-1 h-full w-full">
        </div>

        <div
            v-html="(keyboardKey.message ? keyboardKey.message : '')"
            class="text-right w-full text-600 px-3 line-height-3"
            :style="{
                fontSize: '10px',
                height: '16px'
            }">
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as helper from '../utils';
import * as KeyCode from 'keycode-js';
import { debounce } from 'lodash';

export default {
    name: 'MapPicker',
    emits: ['change'],
    data: () => ({
        mode: null,
        instance: null,
        collection: [],
        shapeinvolve: ['rect', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'text', 'image'],
        selectionEl: null,
        keybind: null,
    }),
    computed: {
        keyboardKey: function(){
            const key = (this.keybind);
            const output = { id: null, message: '' };

            if(key == KeyCode.CODE_META_LEFT){
                output.id = 'add';
            }

            if(key == KeyCode.CODE_SHIFT_LEFT){
                output.id = 'remove';
            }

            switch(output.id){
                case 'add':
                    output.message = 'Hold + CTRL (adding mode)';
                break;
                case 'remove':
                    output.message = 'Hold + SHIFT (removing mode)';
                break;
            }

            return output;
        },
        activeEvent: function(){
            const keycontrol = (this.keyboardKey.id);

            if(['add', 'remove'].includes(keycontrol)){
                return ['drag', 'click'];
            }

            return [];
        }
    },
    methods: {
        loader: async function(filepath = null){
            try{
                const { base } = this.$refs;
                const response = await fetch(filepath);
                const svgContent = await response.text();
                
                let styleSwiper = svgContent.replace(/<svg[^>]*>/, match => match.replace(/ style="[^"]*"/, '')); //# Remove Style <svg style="">
                    styleSwiper = styleSwiper.replace(/class="([^"]*\bland\b[^"]*)"/g, 'class="unit-selector"'); //# Remove Unit Color

                //# Remove Pins
                const parser = new DOMParser();
                const parsedSVG = parser.parseFromString(styleSwiper, 'image/svg+xml');
                const mapPins = parsedSVG.querySelectorAll('.pin');

                mapPins.forEach(e => e.parentNode.removeChild(e));

                styleSwiper = new XMLSerializer().serializeToString(parsedSVG);

                //# Final
                base.innerHTML = styleSwiper;

                await helper.sleep(600);

                await this.install();

                return styleSwiper;
            }catch(e){
                return e;
            }
        },
        install: async function(){
            try{
                const { base } = this.$refs;
                const target = base.querySelector('svg');
                const svg = d3.select(target);

                svg.call(d3.drag()
                    .subject(function(e){
                        const [x = 0, y = 0] = d3.pointer(e);
                        return { x, y };
                    })
                    .on('start', this.onSelectionStart)
                    .on('drag', this.onSelectionMove)
                    .on('end', this.onSelectionEnd)
                );

                svg.on("click", this.onClick);

                window.addEventListener('keydown', ({ code }) => {
                    this.keybind = code;
                });

                window.addEventListener('keyup', (event) => {
                    this.keybind = null;
                });

                this.instance = svg;

            }catch(e){
                console.error(e);
            }
        },
        onClick: function(e){
            e.preventDefault();

            const self = this;
            const shapeTocheck = this.shapeinvolve;

            const eventPath = (e.path || (e.composedPath && e.composedPath()));
            const parentEl = eventPath.find(c => c.classList && c.classList.contains('unit'));
            const keycontrol = (self.keyboardKey.id);

            if(parentEl){
                const shapeunit = parentEl.querySelector(shapeTocheck.join(','));

                if(shapeunit){
                    const selector = (d3.select(shapeunit));

                    switch(keycontrol){
                        case 'add':
                            self.highlighter({ node: selector, checked: true });
                        break;
                        case 'remove':
                            self.highlighter({ node: selector, checked: false });
                        break;
                    }
                }
            }
        },
        onSelectionStart: function(event){
            if(!this.activeEvent.includes('drag')) return;

            const [pointerX = 0, pointerY = 0] = d3.pointer(event, this.instance.node());
            const containerRect = this.instance.node().getBoundingClientRect();

            const x = Math.max(containerRect.left, Math.min(containerRect.right, pointerX));
            const y = Math.max(containerRect.top, Math.min(containerRect.bottom, pointerY));

            this.selectionEl = this.instance.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', 0)
                .attr('height', 0)
                .attr('stroke-width', '1')
                .attr('class', 'selector-area');
        },
        onSelectionEnd: function(){
            if(this.selectionEl){
                this.selectionEl.remove();
            }
        },
        onSelectionMove: function(event){
            if(!this.activeEvent.includes('drag')) return;

            const selection = this.selectionEl;

            const [x = 0, y = 0] = d3.pointer(event, this.instance.node());

            const startX = parseFloat(selection.attr('x'));
            const startY = parseFloat(selection.attr('y'));

            const width = x - startX;
            const height = y - startY;

            selection.attr('width', Math.abs(width));
            selection.attr('height', Math.abs(height));

            selection.attr('x', (width < 0) ? x : startX);
            selection.attr('y', (height < 0) ? y : startY);

            this.emphasizeUnit();
        },
        emphasizeUnit: function(){
            const self = this;
            const selection = this.selectionEl;
            const shapeTocheck = this.shapeinvolve.join(',');
            const selectableElements = this.instance.selectAll('.unit');
            const keycontrol = (this.keyboardKey.id);

            selectableElements.each(function(){
                const parentEl = this;
                const element = d3.select(parentEl.querySelector(shapeTocheck));
                
                if(!selection || !selection.node || !element || !element.node) return;

                const touched = helper.touch(selection.node().getBoundingClientRect(), element.node().getBoundingClientRect());

                if(touched){
                    self.highlighter({
                        node: element,
                        checked: (keycontrol == 'remove' ? false : touched),
                        swip: false
                    });
                }
            });

            this.dispatch('change', [...self.collection]);
        },
        highlighter: function ({ node = null, checked = false, swip = true }){
            const parent = node.select(function(){ return this.closest(".unit") });

            if(parent.size() > 0){
                const id = (parent.attr("id"));
                const currentDataIndex = this.collection.findIndex(c => c == id);

                var performChecked = () => {
                    node.classed('highlighted', true);

                    if(currentDataIndex == -1){
                        this.collection.push(id);
                    }else{
                        if(swip) performUnChecked();
                    }
                };

                var performUnChecked = () => {
                    node.classed('highlighted', false);

                    if(currentDataIndex >= 0) this.collection.splice(currentDataIndex, 1);
                };

                switch(checked){
                    case true:
                        performChecked();
                    break;
                    case false:
                        performUnChecked();
                    break;
                }
            }
        },
        dispatch: debounce(function(e, value){
            this.$emit(e, value);
        }, 300)
    },
    mounted: function(){

    }
}
</script>