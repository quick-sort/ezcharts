import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Popconfirm, Button, Drawer, Input, Select, Icon } from 'antd';
import Line from './Line'
import Bar from './Bar'
import Pie from './Pie'
import { firstValue } from '../utils'
const uuidv4 = require('uuid/v4');

const { Option } = Select;
const SERIES_TYPES = [
  ['pie', '饼图', 'pie-chart'],
  ['line', '折线图', 'line-chart'],
  ['bar', '柱状图', 'bar-chart']
  /*
  ['scatter', '散点图', 'dot-chart'],
  ['boxplot', '盒须图', 'box-plot'],
  ['candlestick', 'K线图', 'sliders'],
  ['table', '表格', 'table']*/
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
        'series.$[i].type': value,
        'series.$[i].encode': {}
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

      default:
        //'line'
        return  <Line {...this.props} />
    }
  }
  render() {
    const { item } = this.props
    return <div>
      <Input.Group compact >
      <Select size="small" onChange={this.onChangeType} value={item.type} showArrow={false} >
      {SERIES_TYPES.map(i => (
              <Option key={'type-' + i[0]} value={i[0]}>
                <Icon type={i[2]} />
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
