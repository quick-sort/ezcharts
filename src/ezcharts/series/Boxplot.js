import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Row, Col, Input, Switch, InputNumber } from 'antd';

import GridEncode from './components/GridEncode'

export default class Boxplot extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        option: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    render() {
        const { onChange, item } = this.props
        const { boxWidth = [7, 50] } = item
        const filter = { arrayFilters: [{ 'i.id': item.id }] };

        return <div>
            <Row>
                <Col span={12}>
                    宽度
                </Col>
                <Col span={12}>
                    <Input.Group compact>
                        <InputNumber
                            value={boxWidth[0]}
                            min={0}
                            style={{width: 50}}
                            onChange={value => {
                                const val = [...boxWidth]
                                val[0] = value
                                onChange({ '$set': { 'series.$[i].boxWidth': val } }, filter)
                            }
                            }
                        />
                        <InputNumber
                            value={boxWidth[1]}
                            min={0}
                            style={{width: 50}}
                            onChange={value => {
                                const val = [...boxWidth]
                                val[1] = value
                                onChange({ '$set': { 'series.$[i].boxWidth': val } }, filter)
                            }
                            }
                        />
                    </Input.Group>
                </Col>
            </Row>
            <Collapse>
                <Collapse.Panel key="encode" header="Grid - Dataset">
                    <GridEncode {...this.props} />
                </Collapse.Panel>
            </Collapse>
        </div>
    }
}