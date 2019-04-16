import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Radio, Row, Col,  Icon, Select, Input } from 'antd';
import Formatter from './Formatter'

const { Option } = Select
export default class Label extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  renderPosition = () => {
    const { onChange, item } = this.props
    const { label = {}, id } = item
    const filter = { arrayFilters: [{ 'i.id': id }] };
    return <Select style={{width: 120}} value={label.position || 'inside'} onChange={value => onChange({'$set': {'series.$[i].label.position': value}}, filter)}>{
      ['top',
        'left',
'right',
'bottom',
'inside',
'insideLeft',
'insideRight',
'insideTop',
'insideBottom',
'insideTopLeft',
'insideBottomLeft',
'insideTopRight',
'insideBottomRight'].map(i => <Option key={'position-' + i} value={i}>{i}</Option>)
      }</Select>
  }

  renderFont = () => {
    const { onChange, item } = this.props
    const { label = {}, id } = item
    const filter = { arrayFilters: [{ 'i.id': id }] };

    return <div><Input.Group compact>
      <InputNumber style={{width: 50}} value={label.fontSize || 12} onChange={(value) => onChange({'$set': {'series.$[i].label.fontSize': value}}, filter)}/>
    </Input.Group>
    <Input.Group compact>
      <Radio.Group value={label.fontStyle || 'normal'} onChange={evt => onChange({'$set': {'series.$[i].label.fontStyle': evt.target.value}}, filter)}>
        <Radio.Button value="normal">A</Radio.Button>
        <Radio.Button value="italic"><Icon type="italic" /></Radio.Button>
      </Radio.Group>
      <Radio.Group value={label.fontWeight|| 'normal'} onChange={evt => onChange({'$set': {'series.$[i].label.fontWeight': evt.target.value}}, filter)}>
        <Radio.Button value="normal">A</Radio.Button>
        <Radio.Button value="bolder"><Icon type="bold" /></Radio.Button>
      </Radio.Group>
    </Input.Group>
      </div>
  }
  renderFormatterTooltip = () => {
    /*
    const tooltips = {
      '{a}': "系列名",
      '{b}': "数据名",
      '{c}': "数据值",
      '{d}': '百分比',
      '{@xxx}':"数据中名为'xxx'的维度的值，如{@product}表示名为'product'的维度的值",
      '{@[n]}':"数据中维度n的值，如{@[3]}` 表示维度 3 的值，从 0 开始计数"
    }*/
    return <div>
      </div>
  }
  render() {
    const leftSpan = 6, rightSpan = 18
    return <div>
      <Row>
        <Col span={leftSpan}>位置</Col>
        <Col span={rightSpan}>
          {this.renderPosition()}
        </Col>
      </Row>
      <Row>
        <Col span={leftSpan}>字体</Col>
        <Col span={rightSpan}>
          {this.renderFont()}
        </Col>
      </Row>
      <Row>
        <Col span={leftSpan}>格式</Col>
        <Col span={rightSpan}>
          <Formatter {...this.props} />
        </Col>
      </Row>
      </div>
  }
}
