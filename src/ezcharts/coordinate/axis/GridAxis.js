import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch, InputNumber, Row, Col, Input} from 'antd';
const { Option } = Select
export default class GridAxis extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    axisType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  render() {
    const { onChange, item, axisType } = this.props
    const {axisLabel = {}, splitLine = {}, type = 'category', inverse} = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    const LSPAN=8, RSPAN=16
    return <div>
      <Row>
          <Col span={LSPAN}>数据类型</Col>
          <Col span={RSPAN}>
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
          <Col span={LSPAN}>刻度最大值
          </Col>
          <Col span={RSPAN}>
          <Switch
            checkedChildren="指定值"
            unCheckedChildren="最大值"
            checked={item.max !== 'dataMax'}
            onChange={value => {
              if (value) {
                onChange({ '$unset': { [`${axisType}.$[i].max`]: '' } }, filter)
              } else {
                onChange({ '$set': { [`${axisType}.$[i].max`]: 'dataMax' } }, filter)
              }
            }}
          /> {item.max !== 'dataMax' ?
            <InputNumber
            value={item.max||0}
            style={{width: 80}}
            onChange={value => onChange({
              [ isNaN(parseFloat(value)) ? '$unset' : '$set']: { [`${axisType}.$[i].max`]: value }
            }, filter)}
          />
          : null}
          </Col>
      </Row>
      <Row>
          <Col span={LSPAN}>刻度最小值
          </Col>
          <Col span={RSPAN}>
          <Switch
            checkedChildren="指定值"
            unCheckedChildren="最小值"
            checked={item.min !== 'dataMin'}
            onChange={value => {
              if (value) {
                onChange({ '$unset': { [`${axisType}.$[i].min`]: '' } }, filter)
              } else {
                onChange({ '$set': { [`${axisType}.$[i].min`]: 'dataMin' } }, filter)
              }
            }}
          /> {item.min !== 'dataMin' ?
            <InputNumber
            value={item.min||0}
            style={{width: 80}}
            onChange={value => onChange({
              [ isNaN(parseFloat(value)) ? '$unset' : '$set']: { [`${axisType}.$[i].min`]: value }
            }, filter)}
          />
          : null}
          </Col>
      </Row>
      <Row>
          <Col span={LSPAN}>反向坐标轴</Col>
          <Col span={RSPAN}>
            <Switch
            checkedChildren="反"
            unCheckedChildren="正"
            checked={inverse}
            onChange={value => onChange({ '$set': { [`${axisType}.$[i].inverse`]: value } }, filter)}
          />
          </Col>
      </Row>
      <Row>
          <Col span={LSPAN}>显示标签</Col>
          <Col span={RSPAN}>
            <Switch
            checkedChildren="有"
            unCheckedChildren="无"
            checked={axisLabel.show !== false}
            onChange={value => onChange({ '$set': { [`${axisType}.$[i].axisLabel.show`]: value } }, filter)}
          />
          </Col>
      </Row>
      <Row>
          <Col span={LSPAN}>标签旋转</Col>
          <Col span={RSPAN}>
            <InputNumber
              value={axisLabel.rotate}
              formatter={value => `${value}°`}
              parser={value => value.replace('°', '')}
              onChange={value => onChange({ '$set': { [`${axisType}.$[i].axisLabel.rotate`]: value } }, filter)}
            />
          </Col>
      </Row>
      <Row>
          <Col span={LSPAN}>标签间隔</Col>
          <Col span={RSPAN}>
            <InputNumber
            value={axisLabel.interval}
            onChange={value =>
              onChange({ '$set': { [`${axisType}.$[i].axisLabel.interval`]: value } }, filter)
            }
          />
          </Col>
      </Row>
      <Row>
          <Col span={LSPAN}>网格线</Col>
          <Col span={RSPAN}>
            <Switch
            checkedChildren="显示"
            unCheckedChildren="不显示"
            checked={type === 'category' ? splitLine.show === true : splitLine.show !== false}
            onChange={value => onChange({ '$set': { [`${axisType}.$[i].splitLine.show`]: value } }, filter)}
          />
          </Col>
      </Row>
      {type === 'category' ? 
      <Row>
          <Col span={LSPAN}>刻度线</Col>
          <Col span={RSPAN}>
            <Switch
            checkedChildren="分隔线"
            unCheckedChildren="刻度线"
            checked={item.boundaryGap !== false }
            onChange={value => onChange({ '$set': { [`${axisType}.$[i].boundaryGap`]: value } }, filter)}
          />
          </Col>
      </Row> : null}
    </div>
  }
}
