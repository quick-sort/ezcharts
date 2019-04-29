import Formatter from './series/components/Formatter'

function filterDataset(options) {
  const { series = [], dataset = [] } = options
  const datasetSize = dataset.length
  return {
    ...options,
    series: series.filter(s => (!s.datasetIndex && datasetSize > 0) || (s.datasetIndex < datasetSize))
  }
}

function filterGridAxis(options) {
  const { xAxis, yAxis, grid = [] } = options
  const gridSize = grid.length
  return {
    ...options,
    xAxis: xAxis ? xAxis.filter(a => (!a.gridIndex && gridSize > 0) || (a.gridIndex < gridSize)): undefined,
    yAxis: yAxis ? yAxis.filter(a => (!a.gridIndex && gridSize > 0) || (a.gridIndex < gridSize)): undefined
  }
}

function filterSeries(options) {
  const { series, xAxis = [], yAxis = [] } = options
  const xAxisSize = xAxis.length
  const yAxisSize = yAxis.length
  return {
    ...options,
    series: series ? series.filter(s => {
      const { type = 'line' } = s
      switch(type) {
        case 'line':
        case 'bar':
          const { xAxisIndex = 0, yAxisIndex = 0 } = s
          return xAxisIndex < xAxisSize && yAxisIndex < yAxisSize
        default:
          return true
      }
    }): undefined
  }
}
function toSafeOption(options) {
  options = filterDataset(options)
  options = filterGridAxis(options)
  options = filterSeries(options)

  options.timestamp = new Date()
  options.color = [
      '#19d4ae',
      '#5ab1ef',
      '#fa6e86',
      '#ffb980',
      '#0067a6',
      '#c4b4e4',
      '#d87a80',
      '#9cbbff',
      '#d9d0c7',
      '#87a997',
      '#d49ea2',
      '#5b4947',
      '#7ba3a8'
    ]
  options.tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  }
  options.series = options.series.map(i => {
    const {label = {}} = i
    const { formatter } = label
    if (formatter) {
      return {
        ...i,
        label: {
          ...label,
          formatter: Formatter.GenFormatter(formatter)
        }
      }
    } else {
      return i
    }
  })
  return options
}
function firstValue(value) {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return value[0]
    }
  } else {
    return value
  }
}
export {
  toSafeOption,
  firstValue
}
