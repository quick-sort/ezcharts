import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch, Button, Input, Tag } from 'antd';
const uuidv4 = require('uuid/v4');
const { Option } = Select
export default class DataZoomInside extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  onRemove = () => {
    const { onChange, item } = this.props
    onChange({
      '$pull': {
        'dataZoom': {
          'id': item.id
        }
      }
    })
  }
  render() {
    const { onChange, item, option } = this.props
    const { grid = [], xAxis = [], yAxis = [] } = option
    const { xAxisIndex = [], yAxisIndex = [] } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    let gridIndex = 0
    if (xAxisIndex.length > 0) {
      gridIndex = xAxis[xAxisIndex[0]].gridIndex
    }
    if (yAxisIndex.length > 0) {
      gridIndex = yAxis[yAxisIndex[0]].gridIndex
    }
    return <Input.Group compact>
      <Tag style={{ height: 24 }}>内置</Tag>
      <Switch
        checkedChildren="水平"
        unCheckedChildren="垂直"
        checked={item.orient !== 'vertical'}
        size="large"
        style={{ height: 24 }}
        onChange={value => onChange({
          '$set': {
            'dataZoom.$[i].orient': value ? 'horizontal' : 'vertical'
          }
        }, filter)}
      />
      <Select
        key="grid"
        value={gridIndex}
        style={{ width: 80 }}
        size="small"
        onChange={value => {
          let update = {}
          if (item.orient !== 'vertical') {
            update['dataZoom.$[i].xAxisIndex'] = xAxis.filter(i => (i.gridIndex || 0) === value)
          } else {
            update['dataZoom.$[i].yAxisIndex'] = yAxis.filter(i => (i.gridIndex || 0) === value)
          }
          onChange({ '$set': update }, filter)
        }
        }
      >
        {grid.map((i, idx) => <Option key={grid - idx} value={idx}>grid{idx + 1}</Option>)}
      </Select>
      <Button size="small" icon='delete' type='danger' onClick={this.onRemove} />
    </Input.Group>
  }
}