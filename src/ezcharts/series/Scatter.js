import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Collapse, Row, Col, Input, Switch } from 'antd';
import GridEncode from './components/GridEncode'

export default class Scatter extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, item } = this.props
    const { itemStyle = {} } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    const LSPAN = 8, RSPAN=16;
    return <div>
      <Row>
        <Col span={LSPAN}>
          点大小
        </Col>
        <Col span={RSPAN}>
          <InputNumber
            value={item.symbolSize}
            onChange={value => onChange({[isNaN(parseFloat(value)) ? '$unset' : '$set']: {'series.$[i].symbolSize': value}}, filter)}
            />
        </Col>
      </Row>
      <Row>
        <Col span={LSPAN}>
          透明度
        </Col>
        <Col span={RSPAN}>
          <InputNumber
            value={itemStyle.opacity}
            onChange={value => onChange({[isNaN(parseFloat(value)) ? '$unset' : '$set']: {'series.$[i].itemStyle.opacity': value}}, filter)}
            />
        </Col>
      </Row>

      <Collapse>
          <Collapse.Panel key="encode" header="Grid - Dataset">
            <GridEncode {...this.props}/>
          </Collapse.Panel>
      </Collapse>
    </div>
  }
}
