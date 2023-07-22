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