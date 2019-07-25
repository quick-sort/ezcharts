import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Row, Col, Input, Switch, InputNumber } from 'antd';
import Label from './components/Label'
import HeatmapEncode from './components/HeatmapEncode'

export default class Heatmap extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, item } = this.props
    const { label = {} } = item
    const LSPAN = 8, RSPAN=16;
    const filter = { arrayFilters: [{ 'i.id': item.id }] };

    return <div>
      <Collapse>
          <Collapse.Panel key="encode" header="Grid - Dataset">
            <HeatmapEncode {...this.props}/>
          </Collapse.Panel>
      </Collapse>
    </div>
  }
}
