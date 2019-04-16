import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'antd';

export default class AngleAxis extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  render() {
    const { item, onChange } = this.props
    return <div>
      <Row>
        <Col span={12}>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
    </div>
  }
}
