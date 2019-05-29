import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Row, Col, Input, Switch, InputNumber } from 'antd';

import GridEncode from './components/GridEncode'
export default class Candlestick extends Component {
  static propTypes = {
      item: PropTypes.object.isRequired,
      option: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
  };
  render() {
    return <div>
      <Collapse>
                <Collapse.Panel key="encode" header="Grid - Dataset">
                    <GridEncode {...this.props} />
                </Collapse.Panel>
            </Collapse>
    </div>
  }
}