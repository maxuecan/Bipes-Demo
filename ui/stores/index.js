function createStore(initialState, handlers) {
    // 1. 集中存储状态
    let state = structuredClone(initialState);
  
    // 2. 用于存储订阅者的列表
    const subscribers = [];
  
    // 3. 历史记录（实现时间旅行）
    const history = [structuredClone(state)];
  
    // 4. 使用 Proxy 实现响应式
    const reactiveState = new Proxy(state, {
        set(target, property, value) {
            target[property] = value;
            // 数据修改后，通知所有订阅者
            notify();
            // 记录快照
            history.push(structuredClone(state));
            return true;
        }
    });
  
    // 通知订阅者更新
    function notify() {
        subscribers.forEach(cb => cb(reactiveState));
    }

    // 统一修改状态的方法（类似 Vuex 的 commit）
    function commit(type, payload) {
        const handler = handlers[type];
        if (handler) {
            handler(reactiveState, payload);
        } else {
            console.warn(`未找到名为 ${type} 的 mutation`);
        }
    }

    // 订阅状态变化（类似 Vuex 的 subscribe）
    function subscribe(callback) {
        subscribers.push(callback);
    }

    // 时间旅行：回退到上一步
    function undo() {
        if (history.length > 1) {
            history.pop(); // 移除当前状态
            const prevState = history[history.length - 1];
            // 恢复状态（注意：这里直接修改了 Proxy 内部的原对象）
            Object.assign(state, prevState); 
            notify();
        }
    }

    return {
        get state() { return reactiveState },
        commit,
        subscribe,
        undo
    };
}

// // --- 实际使用示例 ---

// // 定义初始状态和修改逻辑（mutations）
// const store = createStore(
//   { count: 0, user: 'Guest' },
//   {
//     INCREMENT(state, payload = 1) {
//       state.count += payload;
//     },
//     SET_USER(state, name) {
//       state.user = name;
//     }
//   }
// );

// // 模拟组件订阅状态变化
// store.subscribe((newState) => {
//   console.log('视图更新了！当前状态：', newState);
// });

// // 触发状态修改
// store.commit('INCREMENT', 2); // 输出：视图更新了！当前状态：Proxy { count: 2, user: 'Guest' }
// store.commit('SET_USER', '张三'); // 输出：视图更新了！当前状态：Proxy { count: 2, user: '张三' }

// // 回退状态
// store.undo(); 
// console.log('回退后的状态：', store.state); // 输出：Proxy { count: 2, user: 'Guest' }