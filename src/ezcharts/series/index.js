import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Popconfirm, Button, Drawer, Input, Select, Icon } from 'antd';
import Line from './Line'
import Bar from './Bar'
import Pie from './Pie'
import Boxplot from './Boxplot'
import Scatter from './Scatter'
import Candlestick from './Candlestick'
import Heatmap from './Heatmap'
import { firstValue } from '../utils'
const uuidv4 = require('uuid/v4');

const { Option } = Select;
const SERIES_TYPES = [
  ['pie', '饼图', {type: 'pie-chart'}],
  ['line', '折线图', {type: 'line-chart'}],
  ['bar', '柱状图', {type: 'bar-chart'}],
  ['boxplot', '盒须图', {type: 'box-plot', rotate: 90}],
  ['candlestick', 'K线图', {type: 'sliders'}],
  ['scatter', '散点图', {type: 'dot-chart'}],
  ['heatmap', '热力图', {type: 'heat-map'}]
]

export default class Series extends Component {
  static SERIES_TYPES = SERIES_TYPES
  static propTypes = {
    item: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  state =  {
    drawerVisible: false
  }
  static OnCreate(onChange, defaults ) {
    onChange({
      '$push': {
        series: {
          id: uuidv4(),
          seriesLayoutBy: 'column',
          encode: {},
          label: {},
          ...defaults
        },
      },
    })
  }
  toggleDrawer = () => {
    this.setState({drawerVisible: !this.state.drawerVisible})
  }
  onRemove = () => {
    const { onChange, item } = this.props
    onChange({
      '$pull': {
        'series': {id: item.id}
      }
    })
  }
  onChangeType = (value) => {
    const { onChange, item } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    onChange({
      '$set': {
        'series.$[i].type': value
      }
    }, filter)
  }
  onChangeName = (evt) => {
    const { onChange, item } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    onChange({
      '$set': {
        'series.$[i].name': evt.target.value
      }
    }, filter)
  }
  renderDrawerContent = () => {
    const { item } = this.props
    switch(item.type) {
      case 'bar':
        return <Bar {...this.props}/>

      case 'pie':
        return <Pie {...this.props} />
      
      case 'scatter':
        return <Scatter {...this.props} />

      case 'boxplot':
        return <Boxplot {...this.props} />

      case 'candlestick':
        return <Candlestick {...this.props} />

      case 'heatmap': 
        return <Heatmap {...this.props} />
      default:
        //'line'
        return  <Line {...this.props} />
    }
  }
  render() {
    const { item } = this.props
    const { type } = item
    let compatibles = []
    switch(type) {
      case 'line':
      case 'bar':
      case 'scatter':
        compatibles = ['line', 'bar', 'scatter']
        break
      default:
        compatibles = [type]
    }
    return <div>
      <Input.Group compact >
      <Select size="small" onChange={this.onChangeType} value={item.type} showArrow={false} >
      {SERIES_TYPES.filter(i => compatibles.includes(i[0])).map(i => (
              <Option key={'type-' + i[0]} value={i[0]}>
                <Icon {...i[2]}/>
              </Option>
            ))}
      </Select>
      <Input
        size="small"
        value={item.name || firstValue(item.encode.y)}
        style={{width: 100}}
        onChange={this.onChangeName}
      />
      <Button size="small" icon="setting" onClick={this.toggleDrawer}/>
      <Popconfirm title="确认删除?" placement="left" onConfirm={this.onRemove}>
      <Tooltip title="删除">
      <Button
        size="small"
        icon="delete"
        type="danger"
        style={{color: '#eb2f96'}}
      />
      </Tooltip>
      </Popconfirm>
      </Input.Group>
      <Drawer
        width={320}
        placement="right"
        closable={false}
        onClose={this.toggleDrawer}
        visible={this.state.drawerVisible}

      >
      {this.renderDrawerContent()}
      </Drawer>
      </div>
  }
}
