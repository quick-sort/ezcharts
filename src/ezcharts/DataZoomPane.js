import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Drawer, Button, Input, Tooltip } from 'antd';
import DataZoomSlider from './dataZoom/Slider';
import DataZoomInside from './dataZoom/Inside';
const uuidv4 = require('uuid/v4');
export default class DataZoomPane extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  state = {
    drawerVisible: false
  }
  toggleDrawer = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible })
  }
  onCreate = (type) => {
    const { onChange } = this.props
    onChange({
      '$push': {
        'dataZoom': {
          id: uuidv4(),
          type,
          filterMode: 'weakFilter'
        }
      }
    })
  }

  renderHeader = () => {
    return <Input.Group compact>
    <Tooltip title="图表内使用鼠标滚轮缩放">
      <Button icon='plus' size='small' onClick={i => this.onCreate('inside')}>内置</Button>
      </Tooltip>
      <Tooltip title="显示一个可拖动的滑动条">
      <Button icon='plus' size='small' onClick={i => this.onCreate('slider')}>滑动条</Button>
      </Tooltip>
    </Input.Group>
  }

  renderItem = (item) => {
    const { option, onChange } = this.props
    if (item.type === 'inside') {
      return <DataZoomInside item={item} option={option} onChange={onChange}/>
    } else {
      return <DataZoomSlider item={item} option={option} onChange={onChange}/>
    }
  }

  renderDrawer = () => {
    const { onChange, option } = this.props
    return <List
      dataSource={this.props.option.dataZoom || []}
      renderItem={this.renderItem}
      split={false}
      size="small"
      header={this.renderHeader()}
    />
  }

  render() {
    return <div>
      <Button icon="zoom-in" type="primary" onClick={this.toggleDrawer} >缩放</Button>
      <Drawer
        width={320}
        placement="right"
        closable={false}
        onClose={this.toggleDrawer}
        visible={this.state.drawerVisible}
      >
        {this.renderDrawer()}
      </Drawer>
    </div>
  }
}