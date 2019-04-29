import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Input, Popconfirm, Collapse, Drawer, Button, InputNumber, Icon} from 'antd';
import GridAxis from './axis/GridAxis'
const uuidv4 = require('uuid/v4');

export default class Grid extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    xAxis: PropTypes.array.isRequired,
    yAxis: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  };
  state =  {
    drawerVisible: false
  }

  static OnCreate(onChange, option) {
    const gridIndex = option.grid ? option.grid.length: 0
    const defaultAxis = {
      gridIndex,
      axisLabel: { rotate: 0, interval: 0 },
    }
    onChange({
      '$push': {
        grid: {
          id: uuidv4(),
          containLabel: true,
          left: '3%',
          right: '4%',
          bottom: '3%'
        },
        xAxis: {
          ...defaultAxis,
          id: uuidv4(),
          type: 'category',
        },
        yAxis: {
          ...defaultAxis,
          id: uuidv4(),
          type: 'value',
        },
      },
    })
  }

  toggleDrawer = () => {
    this.setState({drawerVisible: !this.state.drawerVisible})
  }
  onRemove = () => {
    const { onChange, item, xAxis = [], yAxis = [] } = this.props
    onChange({'$pull': {
      grid: {id: item.id}},
      xAxis: {id: { '$in': xAxis.map(i => i.id) }},
      yAxis: {id: { '$in': yAxis.map(i => i.id) }}
    })
  }
  onRemoveAxis = (id, axisType) => {
    const { onChange } = this.props
    onChange({
      '$pull': {
        [axisType]: { id }
      }
    })
  }
  onAddAxis = (axisType) => {
    const { onChange } = this.props
    onChange({
      '$push': {
        [axisType]: {
          id: uuidv4(),
          type: 'category',
          gridIndex: 0,
          axisLabel: { rotate: 0, interval: 0 },
        },
      },
    })
  }
  renderItem = (item, axisType) => {
    const { onChange } = this.props
    const attr = {
      item,
      axisType,
      onChange
    }
    const extra = <Popconfirm title="确认删除?" onConfirm={() => this.onRemoveAxis(item.id, axisType)}>
        <Icon type="delete" />
        </Popconfirm>

    return <Collapse.Panel key={item.id} header={item.name || axisType} extra={extra}>
      <GridAxis {...attr} />
      </Collapse.Panel>
  }
  render() {
    const { item, onChange, name, xAxis, yAxis } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    const inputs = ['left', 'right', 'top', 'bottom'].map(i => (
            <InputNumber
              key={i}
              min={0}
              max={100}
              style={{width: 65}}
              formatter={value => `${i[0].toUpperCase()} ${value}%`}
              parser={value => value.replace(/[a-zA-Z %]*/g, '')}
              value={i in item ? item[i].replace('%', '') : 10}
              onChange={value => onChange({ '$set': { [`grid.$[i].${i}`]: value + '%' } }, filter)}
            />
        ))

    return <div>
        <Input.Group compact>
          <Button size="small" type='primary' onClick={this.toggleDrawer}>{name}<Icon type="setting"/></Button>
          <Popconfirm placement="left" title="确认删除" onConfirm={this.onRemove}>
              <Button size="small" type='danger' icon="close"/>
          </Popconfirm>
        </Input.Group>

    <Drawer
        width={320}
        placement="right"
        closable={false}
        onClose={this.toggleDrawer}
        visible={this.state.drawerVisible}
        >
      <div>
        <Input.Group compact>
        {inputs}
        </Input.Group>
        <Divider />
        <span>添加</span>
        <Button.Group>
          <Button type="primary" onClick={() => this.onAddAxis('xAxis')}>X</Button>
          <Button type="primary" onClick={() => this.onAddAxis('yAxis')}>Y</Button>
        </Button.Group>
      </div>
        <Collapse>
          {xAxis.map(i => this.renderItem(i, 'xAxis'))}
          {yAxis.map(i => this.renderItem(i, 'yAxis'))}
        </Collapse>
      </Drawer>
    </div>
  }
}
