import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Tag, Row, Col, Select, Switch } from 'antd';
import { firstValue } from '../../utils'
const { Option } = Select;

export default class HeatmapEncode extends Component {
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
    if (xAxisIndex < xAxis.length) {
      const { gridIndex = 0 } = xAxis[xAxisIndex]
      this.state = { gridIndex }
    } else {
      this.state = { gridIndex: -1 }
    }
  }
  onChangeGrid = (value) => {
    this.setState({ gridIndex: value })
    const { onChange, option, item } = this.props
    const { xAxis, yAxis } = option
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    onChange({
      '$set': {
        'series.$[i].xAxisIndex': xAxis.findIndex(i => (i.gridIndex || 0) === value),
        'series.$[i].yAxisIndex': yAxis.findIndex(i => (i.gridIndex || 0) === value)
      }
    }, filter)
  }
  renderEncodeX = (encode, encodeOptions, filter) => {
    const { onChange } = this.props
    return <Select
      key="encode-x"
      value={firstValue(encode.x || encodeOptions)}
      style={{ width: 100 }}
      onChange={value => onChange({ '$set': { 'series.$[i].encode.x': value } }, filter)}
    >
      {encodeOptions.map(i => (
        <Option key={'encode-x-' + i} value={i}>
          {i ? i : <span>&nbsp;</span>}
        </Option>
      ))}
    </Select>
  }
  renderEncodeY = (encode, encodeOptions, filter) => {
    const { onChange } = this.props
    return <Select
      key="encode-y"
      value={firstValue(encode.y || encodeOptions.slice(1))}
      style={{ width: 120 }}
      onChange={value => onChange({
        '$set': {
          'series.$[i].encode.y': value
        }
      }, filter)}
    >
      {encodeOptions.map(i => {
        if (firstValue(encode.x) !== i) {
          return <Option key={'encode-y-' + i} value={i}>
            {i ? i : <span>&nbsp;</span>}
          </Option>
        }
        return null
      })}
    </Select>
  }

  renderEncodeValue = (encode, encodeOptions, filter) => {
    const { onChange } = this.props
    return <Select
      key="encode-value"
      value={firstValue(encode.value || encodeOptions.slice(1))}
      style={{ width: 120 }}
      onChange={value => onChange({
        '$set': {
          'series.$[i].encode.value': value,
          'series.$[i].encode.seriesName': value,
        }
      }, filter)}
    >
      {encodeOptions.map(i => {
        if (firstValue(encode.x) !== i && firstValue(encode.y) !== i) {
          return <Option key={'encode-value-' + i} value={i}>
            {i ? i : <span>&nbsp;</span>}
          </Option>
        }
        return null
      })}
    </Select>
  }
  render() {
    const { onChange, option, item } = this.props
    const { xAxis = [], yAxis = [], dataset = [], grid = [] } = option
    const { encode = {}, datasetIndex = 0, seriesLayoutBy = 'column' } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    let encodeOptions = (dataset[datasetIndex] || { source: [[]] }).source[0];
    if (seriesLayoutBy !== 'column') {
      encodeOptions = (dataset[datasetIndex] || { source: [] }).source.map(i => i[0]);
    }
    const LSPAN = 8, RSPAN = 16;
    return <div>
      <Row>
        <Col span={LSPAN}>
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
        <Col span={RSPAN}>
          <Tooltip title="数据集" >
            <Select
              key="datasetIndex"
              value={datasetIndex}
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
              style={{ marginLeft: 10 }}
              checkedChildren="列"
              unCheckedChildren="行"
              checked={seriesLayoutBy === 'column'}
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
        <Col span={LSPAN}>
          <Select
            key="xAxis"
            value={item.xAxisIndex || 0}
            onChange={value => onChange({ '$set': { 'series.$[i].xAxisIndex': value } }, filter)}
          >
            {xAxis.map((i, idx) => {
              const { gridIndex = 0 } = i
              if (gridIndex === this.state.gridIndex) {
                return <Option key={'x' + idx} value={idx}>x{idx + 1}</Option>
              }
              return null
            })}

          </Select>
        </Col>
        <Col span={RSPAN}>
          {this.renderEncodeX(encode, encodeOptions, filter)}
        </Col>
      </Row>
      <Row >
        <Col span={LSPAN}>
          <Select
            key="yAxis"
            value={item.yAxisIndex || 0}
            onChange={value => onChange({ '$set': { 'series.$[i].yAxisIndex': value } }, filter)}
          >
            {yAxis.map((i, idx) => {
              const { gridIndex = 0 } = i
              if (gridIndex === this.state.gridIndex) {
                return <Option key={'y' + idx} value={idx}>y{idx + 1}</Option>
              }
              return null
            })}

          </Select>
        </Col>
        <Col span={RSPAN}>
          {this.renderEncodeY(encode, encodeOptions, filter)}
        </Col>
      </Row>
      <Row>
        <Col span={LSPAN}>
          <Tag >数值</Tag>
        </Col>
        <Col span={RSPAN}>
          {this.renderEncodeValue(encode, encodeOptions, filter)}
        </Col>
      </Row>
    </div>
  }
}
