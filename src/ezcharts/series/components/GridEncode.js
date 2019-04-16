import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Row, Col, Select, Switch } from 'antd';
import { firstValue } from '../../utils'
const { Option } = Select;

export default class Line extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props)
    const { option, item } = props
    const { xAxis = [] } = option
    const { xAxisIndex = 0 } = item
    let gridIndex = -1
    if (xAxis.length > 0) {
      gridIndex = xAxis[xAxisIndex].gridIndex
    }
    this.state = { gridIndex }
  }
  onChangeGrid = (value) => {
    this.setState({gridIndex: value})
  }
  render() {
    const { onChange, option, item } = this.props
    const { xAxis, yAxis, dataset, grid } = option
    const { encode = {} } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    let encodeOptions = (dataset[item.datasetIndex] || { source: [[]] }).source[0];
    if (item.seriesLayoutBy !== 'column') {
      encodeOptions = (dataset[item.datasetIndex] || { source: [] }).source.map(i => i[0]);
    }
    return <div>
      <Row>
        <Col span={12}>
          <Tooltip title="图" >
            <Select
            key="gridIndex"
            value={this.state.gridIndex}
            onChange={this.onChangeGrid}
            >
      {grid.map((i, idx) => <Option key={'grid' + idx} value={idx}>G{idx + 1}</Option>)}
          </Select>
          </Tooltip>
        </Col>
        <Col span={12}>
          <Tooltip title="数据集" >
            <Select
            key="datasetIndex"
            value={item.datasetIndex}
            onChange={value => onChange({ '$set': { 'series.$[i].datasetIndex': value } }, filter)}
            >
            {dataset.map((i, idx) => (
              <Option key={'datasetIndex' + idx} value={idx}>
                {i.id}
              </Option>
            ))}
          </Select>
          </Tooltip>
          <Tooltip title="排列">
          <Switch
            style={{marginLeft: 10}}
            checkedChildren="列"
            unCheckedChildren="行"
            checked={item.seriesLayoutBy === 'column'}
            onChange={value =>
              onChange(
                { '$set': { 'series.$[i].seriesLayoutBy': value ? 'column' : 'row' } },
                filter
              )
            }
          />
          </Tooltip>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Select
            key="xAxis"
            value={item.xAxisIndex || 0}
            onChange={value => onChange({'$set': {'series.$[i].xAxisIndex': value}}, filter)}
            >
      {xAxis.map((i, idx) => {
        if (i.gridIndex === this.state.gridIndex) {
          return <Option key={'xAxis'+idx} value={idx}>xAxis{idx+1}</Option>
        }
        return null
      })}

          </Select>
        </Col>
        <Col span={12}>
          <Select
            key="encode-x"
            value={firstValue(encode.x)}
            style={{ width: 100 }}
            onChange={value => onChange({ '$set': { 'series.$[i].encode.x': value } }, filter)}
          >
            {encodeOptions.map(i => (
              <Option key={'encode-x-' + i} value={i}>
                {i}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row >
        <Col span={12}>
          <Select
            key="yAxis"
            value={item.yAxisIndex || 0}
            onChange={value => onChange({'$set': {'series.$[i].yAxisIndex': value}}, filter)}
            >
      {yAxis.map((i, idx) => {
        if (i.gridIndex === this.state.gridIndex) {
          return <Option key={'yAxis'+idx} value={idx}>yAxis{idx+1}</Option>
        }
        return null
      })}

          </Select>
        </Col>
        <Col span={12}>
          <Select
            key="encode-y"
            value={firstValue(encode.y)}
            style={{ width: 120 }}
            onChange={value => onChange({
              '$set': {
                'series.$[i].encode.y': value,
                'series.$[i].encode.seriesName': value,
              } }, filter)}
          >
            {encodeOptions.map(i => {
              if (firstValue(encode.x) !== i) {
                return <Option key={'encode-x-' + i} value={i}>
                  {i}
                  </Option>
              }
              return null
            })}
          </Select>
        </Col>
      </Row>
    </div>
  }
}
