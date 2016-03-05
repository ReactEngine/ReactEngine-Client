export function loopbackDestroyAll(modeName, payload) {
    return {
        type: 'MODEL_DESTROY_ALL',
        payload: payload,
        meta: {
            modelName: modeName
        }
    }
}

export function loopbackDestroyById(modeName, payload) {
    return {
        type: 'MODEL_DESTROY_BY_ID',
        payload: payload,
        meta: {
            modelName: modeName
        }
    }
}
