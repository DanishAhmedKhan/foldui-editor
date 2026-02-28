type EventHandler<T> = (payload: T) => void

export class EventBus<Events extends Record<string, any>> {
    private listeners: {
        [K in keyof Events]?: EventHandler<Events[K]>[]
    } = {}

    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }

        this.listeners[event]!.push(handler)

        // Return unsubscribe function
        return () => {
            this.listeners[event] = this.listeners[event]!.filter((h) => h !== handler)
        }
    }

    emit<K extends keyof Events>(event: K, payload: Events[K]) {
        this.listeners[event]?.forEach((handler) => {
            handler(payload)
        })
    }

    clear() {
        this.listeners = {}
    }
}
