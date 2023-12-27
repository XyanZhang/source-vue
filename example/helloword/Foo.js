import { h } from '../../lib/guide-vue.esm.js';

export const Foo = {
  setup(props) {
    // props.count
    console.log(props)

    // readonly
    props.count++;
  },
  render() {
    return h("div", {}, "foo: "+this.count)
  }
}