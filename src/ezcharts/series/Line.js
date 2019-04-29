import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Collapse, Row, Col, Input, Switch } from 'antd';
import Label from './components/Label'
import GridEncode from './components/GridEncode'

export default class Line extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, item } = this.props
    const { label = {} } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };

    return <div>
      <Row>
        <Col span={12}>
          <Switch
            checkedChildren="堆叠"
            unCheckedChildren="不堆叠"
            checked={item.stack}
            onChange={value => {
              if (value) {
                onChange({ '$set': { 'series.$[i].stack': 'total', 'series.$[i].areaStyle': {} } }, filter)
              } else {
                onChange({ '$unset': {'series.$[i].stack': '', 'series.$[i].areaStyle': ''}}, filter)
              }
              }
            }
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="堆叠名称"
            disabled={!item.stack}
            value={item.stack}
            style={{width: 80}}
            onChange={value =>
              onChange({ '$set': { 'series.$[i].stack': value.target.value } }, filter)
            }
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          点大小
        </Col>
        <Col span={12}>
          <InputNumber
            value={item.symbolSize}
            onChange={value => onChange({'$set': {'series.$[i].symbolSize': value}}, filter)}
            />
        </Col>
      </Row>

      <Collapse>
          <Collapse.Panel key="encode" header="Grid - Dataset">
            <GridEncode {...this.props}/>
          </Collapse.Panel>
          <Collapse.Panel key="label" header="Label"
              extra={<Switch
              checkedChildren="显示值"
              unCheckedChildren="不显示值"
              checked={label.show}
              onChange={value => {
                if (value) {
                  onChange({ '$set': { 'series.$[i].label.show': true } }, filter)
                } else {
                  onChange({ '$set': {'series.$[i].label.show': false}}, filter)
                }
              }
              }
              />}>
            <Label item={item} onChange={onChange} />
          </Collapse.Panel>
      </Collapse>
    </div>
  }
}
