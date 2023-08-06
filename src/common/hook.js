import { useStore, mapState, mapGetters, mapMutations, mapActions, createNamespacedHelpers } from 'vuex'
import { computed } from 'vue'

// state
export const useMapState = (mapping, namespaceName = '') => {

    let mapFn = mapState;
    if (namespaceName) {
        mapFn = createNamespacedHelpers(namespaceName).mapState;
    }
    let mapped = mapFn(mapping)
    const store = useStore();
    for (let key of Object.keys(mapped)) {
        mapped[key] = computed(mapped[key].bind({ $store: store }))
    }
    return mapped
}

// mutations
export const useMapMutations = (mapping, namespaceName = '') => {
    let mapFn = mapMutations;
    if (namespaceName) {
        mapFn = createNamespacedHelpers(namespaceName).mapMutations
    }

    let mapped = mapFn(mapping)
    const store = useStore();

    // 把里面的每个方法的this执行修改了 并且是一个计算属性包住
    for (let key of Object.keys(mapped)) {
        mapped[key] = mapped[key].bind({ $store: store })
    }
    return mapped
}

// actions
export const useMapActions = (mapping, namespaceName = '') => {
    let mapFn = mapActions;
    if (namespaceName) {
        mapFn = createNamespacedHelpers(namespaceName).mapActions
    }

    let mapped = mapFn(mapping)
    const store = useStore();

    // 把里面的每个方法的this执行修改了 并且是一个计算属性包住
    for (let key of Object.keys(mapped)) {
        mapped[key] = mapped[key].bind({ $store: store })
    }
    return mapped
}

// gitter
export const useGetters = (mapping, namespaceName = '') => {

    let mapFn = mapGetters;
    if (namespaceName) {
        mapFn = createNamespacedHelpers(namespaceName).mapGetters;
    }

    let mapped = mapFn(mapping)
    const store = useStore();

    // 把里面的每个方法的this执行修改了 并且是一个计算属性包住
    for (let key of Object.keys(mapped)) {
        mapped[key] = computed(mapped[key].bind({ $store: store }))
    }

    return mapped
}
