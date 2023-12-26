import { ShapeFlag } from '../shared';

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  };
  debugger;
  if(typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlag.TEXT_CHILDREN;
  }else if(Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlag.ARRAY_CHILDREN;
  }
  return vnode;
}

function getShapeFlag(type: any) {
  return typeof type === 'string'
    ? ShapeFlag.ELEMENT
    : ShapeFlag.STATEFUL_COMPONENT;
}
