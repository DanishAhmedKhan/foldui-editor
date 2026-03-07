import { useEditorStore } from '../../store/useEditorStore'

// export const useActiveBreakpoint = () => {
//     return useEditorStore((state) => {
//         const { device, customWidths } = state

//         if (device === 'responsive') return 'base'
//         if (device === 'desktop') return 'base'
//         if (device === 'tablet') return `min-${customWidths.tablet}`
//         if (device === 'mobile') return `min-${customWidths.mobile}`

//         return 'base'
//     })
// }

export const useActiveBreakpoint = () => {
    return useEditorStore((state) => {
        const { device, customWidths } = state

        if (device === 'responsive' || device === 'desktop') {
            return 'base'
        }

        const width = customWidths[device as keyof typeof customWidths]

        if (!width) return 'base'

        return `min-${width}`
    })
}
