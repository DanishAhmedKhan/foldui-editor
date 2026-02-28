type EditorEventMap = {
    'element:selected': { nodeId: string | null }
    'element:added': { nodeId: string }
    'element:removed': { nodeId: string }
}

type Listener<T> = (payload: T) => void

class EditorEventBus {
    private listeners: {
        [K in keyof EditorEventMap]?: Listener<EditorEventMap[K]>[]
    } = {}

    on<K extends keyof EditorEventMap>(event: K, callback: Listener<EditorEventMap[K]>) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }

        this.listeners[event]!.push(callback)

        return () => {
            this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback)
        }
    }

    emit<K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) {
        this.listeners[event]?.forEach((cb) => cb(payload))
    }
}

export const editorEvents = new EditorEventBus()
