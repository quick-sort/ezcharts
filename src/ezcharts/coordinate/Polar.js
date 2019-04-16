import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Collapse, Drawer, Button, Input, InputNumber, Icon} from 'antd';
import RadiusAxis from './axis/RadiusAxis'
import AngleAxis from './axis/AngleAxis'
const uuidv4 = require('uuid/v4');
export default class Polar extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    radiusAxis: PropTypes.array.isRequired,
    angleAxis: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  };
  state =  {
    drawerVisible: false
  }

  static OnCreate(onChange, option) {
    const polarIndex = option.polar ? option.polar.length: 0
    onChange({
      '$push': {
        polar: { id: uuidv4() },
        radiusAxis: {
          id: uuidv4(),
          polarIndex
        },
        angleAxis: {
          id: uuidv4(),
          polarIndex
        }
      }
    })
  }
  toggleDrawer = () => {
    this.setState({drawerVisible: !this.state.drawerVisible})
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
          polarIndex: 0,
        },
      },
    })
  }
  renderItem = (item, axisType) => {
    const { onChange } = this.props
    const attr = {
      item,
      onChange
    }
    const extra = <Popconfirm title="确认删除?" onConfirm={() => this.onRemoveAxis(item.id, axisType)}>
        <Icon type="delete" />
        </Popconfirm>
    return <Collapse.Panel key={item.id} header={item.name || axisType} extra={extra}>
      {axisType === 'radiusAxis' ?
        <RadiusAxis {...attr}/> :
        <AngleAxis {...attr} />
      }
      </Collapse.Panel>
  }
  render() {
    const { item, onChange, name, radiusAxis, angleAxis } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    return <div>
      <span>{name}</span>
      <Input.Group compact>
        <InputNumber />
        <InputNumber />
      </Input.Group>
      <Button size="small" type='primary' onClick={this.toggleDrawer} icon="setting"/>
      <Drawer
        width={320}
        placement="right"
        closable={false}
        onClose={this.toggleDrawer}
        visible={this.state.drawerVisible}
      >
      <div>
        <div>
        <span>添加</span>
        <Button.Group>
          <Button type="primary" onClick={() => this.onAddAxis('radiusAxis')}>Radius</Button>
          <Button type="primary" onClick={() => this.onAddAxis('angleAxis')}>Angle</Button>
        </Button.Group>
        </div>
        <Collapse>
      {radiusAxis.map(i => this.renderItem(i, 'radiusAxis'))}
      {angleAxis.map(i => this.renderItem(i, 'angleAxis'))}
        </Collapse>
      </div>
      </Drawer>
      </div>
  }
}
