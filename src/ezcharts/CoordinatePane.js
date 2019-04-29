import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon, Select, Input, Button, List} from 'antd';
import Grid from './coordinate/Grid'

const { Option } = Select
//Gird, Polar,
//TODO: Radar, Parallel, Geo, SingleParallel, Calendar
export default class CoordinatePane extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  state = {
    coordinateType: 'grid'
  }

  onCreate = () => {
    const { onChange, option } = this.props
    switch(this.state.coordinateType) {
      default:
        return Grid.OnCreate(onChange, option)
    }
  }
  renderItem = ({type, item, index}) => {
    const { onChange, option } = this.props;

    const attr = {
      item,
      name: type + (index + 1),
      onChange
    }

    switch (type) {
      default:
        const { xAxis = [], yAxis = [] } = option
        attr.xAxis = xAxis.filter(i => {
          const { gridIndex = 0 } = i
          return gridIndex === index
        })
        attr.yAxis = yAxis.filter(i => {
          const { gridIndex = 0 } = i
          return gridIndex === index
        })
        return <Grid {...attr} gridIndex={index}/>
    }
  };
  onChangeType = (type) => {
    this.setState({coordinateType: type})
  }
  renderHeader = () => {
    return <Input.Group compact>
      <Tooltip title="选择坐标系统">
      <Select
          onChange={this.onChangeType}
          size="small"
          value={this.state.coordinateType}
          showArrow={false}
          >
        <Option key="coor-grid" value="grid">
          <Tooltip title="直角坐标">
            <Icon type="line-chart"/>
          </Tooltip>
        </Option>
      </Select>
      </Tooltip>
      <Tooltip title="新建图" >
      <Button
        icon="plus"
        type="primary"
        size='small'
        onClick={this.onCreate}/>
      </Tooltip>

      </Input.Group>
  }
  dataSource = () => {
    const { option } = this.props
    const { grid = [], polar = [] } = option
    let ds = grid.map((item, idx) => ({type: 'grid', item, index: idx}))
    ds = ds.concat(polar.map((item, idx) => ({type: 'polar', item, index: idx})))
    return ds
  }
  render() {
    return (
        <List
          dataSource={this.dataSource()}
          renderItem={this.renderItem}
          split={false}
          size="small"
          header={this.renderHeader()}
        />
    );
  }
}
