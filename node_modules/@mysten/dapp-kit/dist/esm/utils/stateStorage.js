// src/utils/stateStorage.ts
function createInMemoryStore() {
  const store = /* @__PURE__ */ new Map();
  return {
    getItem(key) {
      return store.get(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}
export {
  createInMemoryStore
};
//# sourceMappingURL=stateStorage.js.map
