# tips

## 环境

### jest es6模块支持

<https://jestjs.io/docs/getting-started>

### jest 命令

```powershell
yarn test reactive # 测试单个文件 reactive
```

### reactive

流程：

- reactive -> createReactiveObject -> createGetter -> createSetter

### effect

流程：

- effect -> createReactiveEffect -> effect -> createReactiveEffect -> createTrack -> createTrigger -> track -> trigger

### computed

流程：

- computed -> createComputedGetter -> createComputed -> effect

### watchEffect

流程：

- watchEffect -> createWatcher -> watch

### watch

流程：

- watch -> createWatcher -> watch

### ref

流程：

- ref -> createRef -> ref -> createRef -> createReactiveObject -> createGetter -> createSetter

### shallowReactive

流程：

- shallowReactive -> createReactiveObject -> createGetter -> createSetter

### shallowRef

流程：

- shallowRef -> createRef -> ref -> createRef -> createReactiveObject -> createGetter -> createSetter

### toRefs

流程：

- toRefs -> toProxy -> createGetter -> createSetter

### toRef

流程：

- toRef -> createRef -> ref -> createRef -> createReactiveObject -> createGetter -> createSetter

### isRef

流程：

- isRef -> isObject -> toRawType

### isReactive

流程：

- isReactive -> isObject -> toRawType

### isReadonly

流程：

- isReadonly -> isObject -> toRawType

### isProxy

流程：

- isProxy -> isObject -> toRawType

### markRaw

流程：

- markRaw -> createReactiveObject -> createGetter -> createSetter

### unref

流程：

- unref -> isRef -> isProxy -> toRaw -> toRawType

### reactive

流程：

- reactive -> createReactiveObject -> createGetter -> createSetter

### readonly

流程：

- readonly -> createReactiveObject -> createGetter -> createSetter

### shallowReadonly

流程：

- shallowReadonly -> createReactiveObject -> createGetter -> createSetter

### shallowReactive

流程：

- shallowReactive -> createReactiveObject -> createGetter -> createSetter

### computed

流程：

- computed -> createComputedGetter -> createComputed -> effect

### watchEffect

流程：

- watchEffect -> createWatcher -> watch

### watch

流程：

- watch -> createWatcher -> watch

### watchEffect

流程：

- watchEffect -> createWatcher -> watch

### scheduler 任务调度

scheduler 负责管理组件的更新队列，以及控制组件更新的时机和方式。它基于浏览器的事件循环机制，将组件更新的任务分解为微任务和宏任务，并根据优先级和异步策略来调度任务的执行

- 排队： scheduler 会将需要更新的组件添加到更新队列中，确保它们按照正确的顺序进行更新，避免出现不一致的视图状态。
- 调度： scheduler 使用浏览器提供的 requestAnimationFrame API 或 setImmediate API（取决于环境）来调度更新任务的执行。
- 优化： scheduler 利用任务优先级和异步策略来确定更新任务的执行时机，可以根据情况合并和批量执行更新，以提高性能和效率。
- 防抖节流： scheduler 还可以通过防抖和节流的机制来优化频繁触发的更新，减少不必要的重复计算和渲染。
