export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()

  // 
  setupStatefullComponent(instance)
  
}

function setupStatefullComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;

  if(setup) {
    const setupResult = setup();

    handleSetupResult(instance, setupResult) 
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  // function Object

  if(typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  instance.render  = Component.render;
  // if(Component.render) {
  // }
}

