import { isObject } from "../reactivity/utils";
import { ShapeFlag } from "../shared";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch 
  // 

  patch(vnode, container);
}

function patch(vnode, container) {
  const { shapeFlag } = vnode;
  
  // 判断 是不是 element
  console.log(vnode.type);
  if(shapeFlag & ShapeFlag.ELEMENT) {
    // element
    processElement(vnode, container)
  }else if(shapeFlag & ShapeFlag.STATEFUL_COMPONENT) {
    // 处理组件
    processComponent(vnode, container)
  }
  
  
}

function processComponent(vnode: any, container: any) { 
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container: any) {
  const instance =  createComponentInstance(initialVNode)

  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy, container);

  // vnode -> patch
  // vnode -> element -> mountElement
  
  patch(subTree, container);

  // element -> mount
  // 获取el
  initialVNode.el = subTree.el
}
function processElement(vnode: any, container: any) {
  // init 
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));
  const { children, shapeFlag } = vnode;
  if(shapeFlag & ShapeFlag.TEXT_CHILDREN) {
    el.textContent = children;
  }else if(shapeFlag & ShapeFlag.ARRAY_CHILDREN) {
    // vnode 
    mountChildren(vnode, el);
  }
  // props
  const { props } = vnode;
  for(const key in props) {
    const val = props[key];
    el.setAttribute(key, val)
  }

  container.append(el);
}



function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container);
  })
}