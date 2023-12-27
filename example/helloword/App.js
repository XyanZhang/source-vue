import { h } from '../../lib/guide-vue.esm.js';
import { Foo } from './Foo.js';
window.self = null;
export const App = {
  // .vue
  // <template>

  // render
  render() {
    window.self = this;

    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'small'],
        onClick() {
          console.log('render');
        },
      },
      // setupState
      // this.$el
      [
        h('div', {}, 'hi,' + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
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
