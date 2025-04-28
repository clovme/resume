import { ILineBox } from '../interface/interface.ts'

const VLineBox = {
  color: (props: ILineBox): string => {
    return props.color ?? '#ddd'
  },
  margin: (props: ILineBox): { margin: string; padding: string } => {
    const position = props.position?.toLowerCase() ?? 'bottom'
    // 对边对应
    const index = { top: 2, right: 3, bottom: 0, left: 1 }[position] as 0
    const indexs = { top: [1, 3], right: [0, 2], bottom: [1, 3], left: [0, 2] }[
      position
    ] as [0, 2]

    let margin = [
      `${props.margin}px`,
      `${props.margin}px`,
      `${props.margin}px`,
      `${props.margin}px`,
    ]
    let padding = [
      `${props.margin}px`,
      `${props.margin}px`,
      `${props.margin}px`,
      `${props.margin}px`,
    ]

    for (const index of indexs) {
      margin[index] = `0px`
      padding[index] = `0px`
    }

    margin[index] = `0px`
    padding[index] = `0px`

    return { margin: margin.join(' '), padding: padding.join(' ') }
  },
}

export default VLineBox
