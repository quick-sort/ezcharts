import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Input, Select } from 'antd'

const { Option } = Select

function getFormatterType(formatter) {
  let type = 'template'
  if (typeof(formatter) === 'object') {
    type = formatter.type || 'baseUnit'
  }
  return type
}
class BaseUnitFormatter extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  static GenPieFormatter(data) {
    return (params) => {
      const {base, unit} = data
      const baseNumber = parseFloat(base)
      let value = parseFloat(params.value)
      if (!Number.isNaN(baseNumber) && baseNumber !== 0) {
        value = (value / baseNumber).toFixed(2)
      }
      return `${params.name} (${value}${unit} ${params.percent}%)`
    }
  }
  static GenFormatter(data) {
    return (params) => {
      const { base, unit } = data
      const baseNumber = parseFloat(base)
      let value = parseFloat(params.value)
      if (!Number.isNaN(baseNumber) && baseNumber !== 0) {
        if (value < baseNumber) {
          value = (value / baseNumber).toFixed(2)
        } else {
          value = (value / baseNumber).toFixed(1)
        }
      }
      return `${value}${unit}`
    }
  }
  render() {
    const { onChange, item } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    const { label = {} } = item
    const { formatter = {} } = label
    const { data = {} } = formatter

    return <Input.Group compact>
      <InputNumber
          placeholder="基数"
          value={data.base}
          onChange={value => onChange({'$set': {'series.$[i].label.formatter.data.base': value}}, filter)}
          />
      <Input
          placeholder="单位"
          value={data.unit}
          onChange={evt => onChange({'$set': {'series.$[i].label.formatter.data.unit': evt.target.value}}, filter)}
          />
      </Input.Group>
  }
}

export default class Formatter extends Component {
  /*
   * formatter = ''
   * formatter = { type: 'baseUnit', data: {base, unit} }
   *
   */
  static propTypes = {
    item: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  static GenFormatter(formatter) {
    const type = getFormatterType(formatter)
    const { data } = formatter
    switch(type) {
      case 'pieBaseUnit':
        return BaseUnitFormatter.GenPieFormatter(data)
      case 'baseUnit':
        return BaseUnitFormatter.GenFormatter(data)
      default:
        return formatter
    }
  }
  onChange = (value) => {
    const { onChange, item } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    if (value === 'template') {
      onChange({'$unset': {'series.$[i].label.formatter': ''}}, filter)
    } else {
      onChange({'$set': {'series.$[i].label.formatter': { type: value, data: { base: 1, unit: '' } }}}, filter)
    }
  }
  renderFormatter = () => {
    const { onChange, item } = this.props
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    const { label = {}} = item
    const { formatter } = label
    const type = getFormatterType(formatter)
    if (type !== 'template') {
      return <BaseUnitFormatter {...this.props}/>
    } else {
      return <Input
          placeholder="字符串模板"
          value={formatter}
          onChange={value => {
            if (value === '') {
              onChange({ '$unset': { 'series.$[i].label.formatter': '' }}, filter)
            } else {
              onChange({ '$set': { 'series.$[i].label.formatter': value.target.value } }, filter)
            }
          }
        }
        />
    }
  }

  render() {
    const { item } = this.props
    const { label = {} } = item
    const { formatter } = label

    return <span>
      <Select onChange={this.onChange} value={getFormatterType(formatter)} showArrow={false}>
        <Option key="template" value="template">字符串模板</Option>
        <Option key="baseUnit" value="baseUnit">基数单位</Option>
        <Option key="pieBaseUnit" value="pieBaseUnit">基数单位百分比</Option>
      </Select>
      {this.renderFormatter()}
    </span>
  }
}
