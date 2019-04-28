import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch, InputNumber, Row, Col} from 'antd';
const { Option } = Select
export default class GridAxis extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    axisType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  render() {
    const { onChange, item, axisType } = this.props
    const {axisLabel = {} } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    return <div>
      <Row>
          <Col span={12}>数据类型</Col>
          <Col span={12}>
            <Select
              key="axis-type"
              value={item.type}
              style={{width: 80}}
              onChange={value => onChange({ '$set': { [`${axisType}.$[i].type`]: value } }, filter)}
            >
              <Option key="value" value="value">数值</Option>
              <Option key="log" value="log">对数</Option>
              <Option key="category" value="category">类目</Option>
              <Option key="time" value="time">时间</Option>
            </Select>
          </Col>
      </Row>
      <Row>
          <Col span={12}>显示标签</Col>
          <Col span={12}>
            <Switch
            checkedChildren="有"
            unCheckedChildren="无"
            checked={axisLabel.show !== false}
            onChange={value => onChange({ '$set': { [`${axisType}.$[i].axisLabel.show`]: value } }, filter)}
          />
          </Col>
      </Row>
      <Row>
          <Col span={12}>标签旋转</Col>
          <Col span={12}>
            <InputNumber
              value={axisLabel.rotate}
              formatter={value => `${value}°`}
              parser={value => value.replace('°', '')}
              onChange={value => onChange({ '$set': { [`${axisType}.$[i].axisLabel.rotate`]: value } }, filter)}
            />
          </Col>
      </Row>
      <Row>
          <Col span={12}>标签间隔</Col>
          <Col span={12}>
            <InputNumber
            value={axisLabel.interval}
            onChange={value =>
              onChange({ '$set': { [`${axisType}.$[i].axisLabel.interval`]: value } }, filter)
            }
          />
          </Col>
      </Row>
    </div>
  }
}
