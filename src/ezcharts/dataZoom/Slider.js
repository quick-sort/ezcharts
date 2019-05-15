import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Select, Switch, Tag, Button, Input } from 'antd';
const uuidv4 = require('uuid/v4');
const { Option } = Select
export default class DataZoomSlider extends Component {
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
    const { xAxis = [], yAxis = [] } = option
    const { orient = 'horizontal', xAxisIndex = [], yAxisIndex = []} = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    const axisIndex = orient === 'horizontal' ? xAxisIndex : yAxisIndex
    return <Input.Group compact>
    <Tooltip title="显示一个可拖动的滑动条">
      <Tag style={{ height: 24 }}>滑动条</Tag>
      </Tooltip>
      <Switch
        checkedChildren="水平"
        unCheckedChildren="垂直"
        style={{ height: 24 }}
        checked={orient === 'horizontal'}
        onChange={value => onChange({ 
          '$set': { 
            'dataZoom.$[i].orient': value ? 'horizontal' : 'vertical'
          },
          '$unset': {
            ['dataZoom.$[i].' + (value ? 'yAxisIndex' : 'xAxisIndex') ]: ''
          }
        }, filter)}
      />
      <Select
        key="grid"
        value={axisIndex}
        mode="multiple"
        style={{ width: 120}}
        size="small"
        onChange={value => {
          let update = {}
          if (item.orient !== 'vertical') {
            update['dataZoom.$[i].xAxisIndex'] = value
          } else {
            update['dataZoom.$[i].yAxisIndex'] = value
          }
          onChange({ '$set': update }, filter)
        }
        }
      >
        {orient === 'horizontal' ? 
          xAxis.map((i,idx) => <Option key={'xAxis' + idx} value={idx}>g{(i.gridIndex || 0) + 1}-x{idx + 1}</Option>)
          :
          yAxis.map((i,idx) => <Option key={'yAxis' + idx} value={idx}>g{(i.gridIndex || 0) + 1}-y{idx + 1}</Option>)}
      </Select>
      
      <Button size="small" icon='delete' type='danger' onClick={this.onRemove} />
    </Input.Group>
  }
}