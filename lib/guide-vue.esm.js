var isObject = function (val) { return typeof val === 'object' && val !== null; };

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots()
    // 
    setupStatefullComponent(instance);
}
function setupStatefullComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({}, {
        get: function (target, key) {
            // setupState
            var setupState = instance.setupState;
            if (key in setupState) {
                return setupState[key];
            }
        }
    });
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    instance.render = Component.render;
    // if(Component.render) {
    // }
}

function render(vnode, container) {
    // patch 
    // 
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断 是不是 element
    console.log(vnode.type);
    if (typeof vnode.type === "string") {
        // element
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy, container);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}
function processElement(vnode, container) {
    // init 
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = document.createElement(vnode.type);
    var children = vnode.children;
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // vnode 
        mountChildren(vnode, el);
    }
    // props
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // vnode
            // component -> vnode
            // 逻辑操作依赖于vnode
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
