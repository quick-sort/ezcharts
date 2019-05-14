import Formatter from './series/components/Formatter'

function filterGridAxis(options) {
  const { xAxis, yAxis, grid = [] } = options
  const gridSize = grid.length
  function filterAxis(a) {
    const { gridIndex = 0 } = a
    return gridIndex < gridSize && gridIndex >= 0
  }
  return {
    ...options,
    xAxis: xAxis ? xAxis.filter(filterAxis): undefined,
    yAxis: yAxis ? yAxis.filter(filterAxis): undefined
  }
}

function filterSeries(options) {
  const { series, xAxis = [], yAxis = [], grid = [], dataset = [] } = options
  const datasetSize = dataset.length
  const xAxisSize = xAxis.length
  const yAxisSize = yAxis.length
  return {
    ...options,
    series: series ? series.filter(s => {
      const { type = 'line', datasetIndex = 0 } = s
      if (datasetIndex >= datasetSize || datasetIndex < 0) {
        return false
      }
      switch(type) {
        case 'boxplot':
          const { encode = {} } = s
          const { y = []} = encode
          const uniqueY = {}
          y.forEach(i => {
            if (i) {
              uniqueY[i] = ''
            }
          })
          return Object.keys(uniqueY).length === 5
        case 'line':
        case 'bar':
          const { xAxisIndex = 0, yAxisIndex = 0 } = s
          if (xAxisIndex >= xAxis.length || xAxisIndex < 0) return false
          if (yAxisIndex >= yAxis.length || xAxisIndex < 0) return false
          const { gridIndex:xGridIndex = 0 } = xAxis[xAxisIndex]
          const { gridIndex:yGridIndex = 0 } = yAxis[yAxisIndex]
          return xAxisIndex < xAxisSize && yAxisIndex < yAxisSize && xGridIndex === yGridIndex && xGridIndex < grid.length
        default:
          return true
      }
    }): undefined
  }
}
function safeDataset(options) {
  const { dataset = [], series = [] } = options
  dataset.forEach(i => {
    const { source = [] } = i
    if (source.length > 0) {
      source[0] = source[0].map(i => {
        if (/^[0-9]+$/.test(i)) {
          return '_' + i
        } else {
          return i
        }
      })
    }
  })
  series.forEach(i => {
    const { encode = {} } = i
    Object.keys(encode).forEach(k => {
      if (/^[0-9]+$/.test(encode[k])) {
        encode[k] = '_' + encode[k]
      }
    })
  })
}
function toSafeOption(options) {
  options = filterSeries(options)
  options = filterGridAxis(options)

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
  options.series = (options.series||[]).map(i => {
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
  safeDataset(options)
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
