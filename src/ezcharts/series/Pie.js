import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Tooltip, Row, Col, Select, Input, Switch, InputNumber } from 'antd';
import Label from './components/Label'
const { Option } = Select;

export default class Pie extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  render() {
    const { onChange, option, item } = this.props
    const { dataset } = option
    const { label = {}, encode = {}, datasetIndex = 0, seriesLayoutBy = 'column' } = item
    const filter = { arrayFilters: [{ 'i.id': item.id }] };
    let encodeOptions = (option.dataset[datasetIndex] || { source: [[]] }).source[0];
    if (seriesLayoutBy !== 'column') {
      encodeOptions = (option.dataset[datasetIndex] || { source: [] }).source.map(i => i[0]);
    }
    return <div>
      <Row>
        <Col span={8}>
        数据集
        </Col>
        <Col span={16}>
          <Tooltip title="数据集" >
            <Select
            key="datasetIndex"
            value={item.datasetIndex}
            onChange={value => onChange({ '$set': { 'series.$[i].datasetIndex': value } }, filter)}
            >
            {dataset.map((i, idx) => (
              <Option key={'datasetIndex' + idx} value={idx}>
                {i.id}
              </Option>
            ))}
          </Select>
          </Tooltip>
          <Tooltip title="排列">
          <Switch
            style={{marginLeft: 10}}
            checkedChildren="列"
            unCheckedChildren="行"
            checked={item.seriesLayoutBy === 'column'}
            onChange={value =>
              onChange(
                { '$set': { 'series.$[i].seriesLayoutBy': value ? 'column' : 'row' } },
                filter
              )
            }
          />
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          类别名称
        </Col>
        <Col span={16}>
          <Select
            key="encode-itemName"
            value={encode.itemName}
            style={{ width: 100 }}
            onChange={value => onChange({ '$set': { 'series.$[i].encode.itemName': value } }, filter)}
          >
            {encodeOptions.map(i => <Option key={'encode-itemName-' + i} value={i}>
                {i}
              </Option>
            )}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          类别数据
        </Col>
        <Col span={16}>
          <Select
            key="encode-value"
            value={encode.value}
            style={{ width: 100 }}
            onChange={value => onChange({ '$set': { 'series.$[i].encode.value': value } }, filter)}
          >
      {encodeOptions.map(i => {
        if (i !== encode.itemName) {
            return <Option key={'encode-value-' + i} value={i}>
                {i}
              </Option>
        }
        return null
      }
            )}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          位置
        </Col>
        <Col span={16}>
        <Input.Group compact>
          <Tooltip title="水平位置" >
            <InputNumber
              min={0}
              max={100}
              style={{width: 60}}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              value={(item.center || ['50%', '50%'])[0].replace('%', '')}
              onChange={value => {
                const values = item.center || ['50%', '50%'];
                values[0] = value + '%';
                onChange({ '$set': { [`series.$[i].center`]: values } }, filter);
              }}
            />
          </Tooltip>
          <Tooltip title="垂直位置" >
            <InputNumber
              min={0}
              max={100}
              style={{width: 60}}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              value={(item.center || ['50%', '50%'])[1].replace('%', '')}
              onChange={value => {
                const values = item.center || ['50%', '50%'];
                values[1] = value + '%';
                onChange({ '$set': { [`series.$[i].center`]: values } }, filter);
              }}
            />
          </Tooltip>
          </Input.Group>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          半径
        </Col>
        <Col span={16}>
          <Tooltip title="半径">
          <InputNumber
              min={0}
              max={100}
              style={{width: 60}}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              value={(item.radius|| '50%').replace('%', '')}
              onChange={value => onChange({ '$set': { 'series.$[i].radius': value + '%' } }, filter)}
            />
          </Tooltip>
        </Col>
      </Row>
      <Collapse>
          <Collapse.Panel key="label" header="label"
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
