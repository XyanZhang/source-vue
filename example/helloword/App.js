import { h } from '../../lib/guide-vue.esm.js';

export const App = {
  // .vue
  // <template>

  // render
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'small'],
      },
      // setupState
      // this.$el
      "hi, "+this.msg
      // [
      //   h('p', { class: 'child-class' }, 'hi'),
      //   h('p', { class: 'child-class2' }, 'hi 2'),
      //   h('p', { class: 'child-class3' }, [
      //     h('span', { class: 'span-class' }, 'hi span'),
      //     h('span', { class: 'span-class2' }, 'hi span2'),
      //   ]),
      // ]
    );
  },
  setup() {
    return {
      msg: 'mini-vue hello Xyan',
    };
  },
};
