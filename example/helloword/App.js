export const App = {
  // .vue
  // <template>
  
  // render
  render() {
    return history("div", "hi, "+this.msg);
  },
  setUp() {
    return{
      msg: "mini-vue"
    }
  }
}