import { EventBus } from './eventBus'
import { EditorEventMap } from './editorEvents'

export const editorEventBus = new EventBus<EditorEventMap>()
