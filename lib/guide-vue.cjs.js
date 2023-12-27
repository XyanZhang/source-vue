'use strict';

// 将容器放到WeakMap中, 为什么要用WeakMap，因为WeakMap的key是弱引用，不会造成内存泄漏
var targetMap = new WeakMap();
function track(target, key) {
    // 依赖收集
    console.log('target: ', target, 'key: ', key);
    // 构建一个容器
    // target => key => dep
    var depsMap = targetMap.get(target); // 取出target对应的容器
    if (!depsMap) {
        // 如果没有容器，就创建一个容器
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    // 有容器，取出key对应的容器
    var dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep); // 保存 key对应的容器
    }
}
function trigger(target, key) {
    var deps = [];
    // 触发依赖
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    var dep = depsMap.get(key);
    deps.push(dep);
    var effects = [];
    deps.forEach(function (dep) {
        effects.push.apply(effects, dep);
    });
}

var isObject = function (val) { return typeof val === 'object' && val !== null; };
function createGetter(isReadonly, shallow) {
    if (shallow === void 0) { shallow = false; }
    return function get(target, key, receiver) {
        var res = Reflect.get(target, key, receiver);
        if (key === '_is_reactive') {
            return !isReadonly;
        }
        if (key === '_is_readonly') {
            return isReadonly;
        }
        // 依赖收集
        track(target, key); // target: {age: 10}, key: age
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(isReadonly, isShallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    return function setter(target, key, value) {
        var res = Reflect.set(target, key, value);
        if (isReadonly) {
            console.warn("set ".concat(JSON.stringify(target), " on key ").concat(key, " failed"));
            return true;
        }
        // 触发依赖
        trigger(target, key); // target: {age: 10}, key: age
        return res;
    };
}
function reactive(raw) {
    return createReactiveObject(raw);
}
function createReactiveObject(raw, isReadonly, isShallow) {
    if (!isObject(raw)) {
        console.warn("target ".concat(raw, " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return raw;
    }
    return new Proxy(raw, {
        get: createGetter(isReadonly, isShallow),
        set: createSetter(isReadonly)
    });
}
function readonly(raw) {
    return createReactiveObject(raw, true);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, true, true);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {}
    };
    return component;
}
function setupComponent(instance) {
    // initSlots()
    initProps(instance, instance.vnode.props);
    // 
    setupStatefullComponent(instance);
}
function setupStatefullComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props));
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
    var shapeFlag = vnode.shapeFlag;
    // 判断 是不是 element
    console.log(vnode.type);
    if (shapeFlag & 1 /* ShapeFlag.ELEMENT */) {
        // element
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlag.STATEFUL_COMPONENT */) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy, container);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    // element -> mount
    // 获取el
    initialVNode.el = subTree.el;
}
function processElement(vnode, container) {
    // init 
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 4 /* ShapeFlag.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlag.ARRAY_CHILDREN */) {
        // vnode 
        mountChildren(vnode, el);
    }
    // props
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
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
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlag.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlag.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ShapeFlag.ELEMENT */
        : 2 /* ShapeFlag.STATEFUL_COMPONENT */;
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

exports.createApp = createApp;
exports.h = h;
