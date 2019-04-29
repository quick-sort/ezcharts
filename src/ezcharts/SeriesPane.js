import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Button, Icon, Select, Input, List } from 'antd';
import Series from './series'

const { Option } = Select;
//Line, Bar, Pie
//TODO:
export default class SeriesPane extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }
  state = {
    datasetIndex: 0,
    type: 'line'
  }

  onCreate = () => {
    const { onChange } = this.props
    Series.OnCreate(onChange, this.state)
  }

  onChangeDataset = (value) => {
    this.setState({datasetIndex: value})
  }
  onChangeSeriesType = (value) => {
    this.setState({type: value})
  }
  renderHeader = () => {
    const { option } = this.props
    const { dataset = []} = option
    return <div>
      <Input.Group compact>
      <Tooltip title="选择类型">
      <Select
        onChange={this.onChangeSeriesType}
        value={this.state.type}
        size='small'
        showArrow={false}>
      {Series.SERIES_TYPES.map(i => (
              <Option key={'type-' + i[0]} value={i[0]}>
                <Icon type={i[2]} />
              </Option>
            ))}
      </Select>
      </Tooltip>
      <Tooltip title="选择数据集">
      <Select
          onChange={this.onChangeDataset}
          value={this.state.datasetIndex}
          size='small'
          style={{width: 138}}
          showArrow={false} >
      {dataset.map((i, idx) => (
              <Option key={'dataset-' + idx} value={idx}>
              {i.id}
              </Option>
            ))}
      </Select>
      </Tooltip>
      <Tooltip title="新建系列" placement="left">
      <Button
        icon="plus"
        type="primary"
        size='small'
        onClick={this.onCreate}/>
      </Tooltip>
      </Input.Group>
    </div>
  }
  renderItem = (item) => {
    return <Series {...this.props} item={item}/>
  }
  render() {
    const { option } = this.props;
    return <List
          dataSource={option.series}
          renderItem={this.renderItem}
          split={false}
          size="small"
          header={this.renderHeader()}
      />
  }
}
