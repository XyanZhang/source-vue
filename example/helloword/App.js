import { h } from "../../lib/guide-vue.esm.js";


export const App = {
  // .vue
  // <template>
  
  // render
  render() {
    return h("div", "hi, "+this.msg);
  },
  setUp() {
    return{
      msg: "mini-vue"
    }
  }
}