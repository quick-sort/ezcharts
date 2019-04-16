import React, { Component } from 'react';
import { Divider, Layout } from 'antd';
import ReactEcharts from 'echarts-for-react';
import mongobj from 'mongobj';
import { toSafeOption } from './utils'
import DatasetPane from './DatasetPane';
import CoordinatePane from './CoordinatePane';
import SeriesPane from './SeriesPane';
import JsonPane from './JsonPane'
const uuidv4 = require('uuid/v4');

const { Content, Sider }  = Layout
export default class EzCharts extends Component {
  static propTypes = {};
  static getDerivedStateFromProps(props, state) {
    const { option } = props;
    if (option) {
      return {
        option: {
          id: option.id,
          title: option.title,
          grid: option.grid || [{ id: uuidv4(), containLabel: true }],
          dataset: option.dataset || [],
          xAxis: option.xAxis || [
            {
              id: uuidv4(),
              type: 'category',
              gridIndex: 0,
              axisLabel: { rotate: 0, interval: 0 },
            }],
          yAxis: option.yAxis || [
            {
              id: uuidv4(),
              type: 'value',
              gridIndex: 0,
              axisLabel: { rotate: 0, interval: 0 },
            },
          ],
          series: option.series || [],
        },
      };
    } else {
      return null;
    }
  }
  constructor(props) {
    super(props);
    const { defaultOption = {}, option = {} } = props;
    this.state = {
      option: {
        title: option.title || 'chart',
        grid: option.grid ||
          defaultOption.grid || [{ id: uuidv4(), containLabel: true }],
        dataset: option.dataset || defaultOption.dataset || [],
        xAxis: option.xAxis ||
          defaultOption.xAxis || [
            {
              id: uuidv4(),
              type: 'category',
              gridIndex: 0,
              axisLabel: { rotate: 0, interval: 0 },
            }],
        yAxis: option.yAxis ||
            defaultOption.yAxis || [
            {
              id: uuidv4(),
              type: 'value',
              gridIndex: 0,
              axisLabel: { rotate: 0, interval: 0 },
            }
          ],
        series: option.series || defaultOption.series || [],
      },
    };
  }
  onReplace = (option) => {
    this.setState({option})
    if (this.props.onChange) {
      this.props.onChange(option);
    }
  }
  onChange = (changes, options) => {
    const { option } = this.state;
    const newOption = mongobj.update({ ...option }, changes, options);
    this.setState({ option: newOption });
    if (this.props.onChange) {
      this.props.onChange(newOption, changes, options);
    }
  };
  ;
  render() {
    const { option } = this.state;
    const { style = {height: 600}, onEvents = {} } = this.props

    return (
      <Layout className="ezcharts">
        <Layout>
          <Content>
            <ReactEcharts option={toSafeOption(option)} onEvents={onEvents} notMerge style={style} />
          </Content>
        </Layout>
        <Sider className="ezcharts-panel" theme="light" width={220} >
          <DatasetPane option={option} onChange={this.onChange} />
          <Divider />
          <SeriesPane option={option} onChange={this.onChange} />
          <Divider />
          <CoordinatePane option={option} onChange={this.onChange} />
          <Divider />
          <JsonPane option={option} onChange={this.onReplace} />
        </Sider>
      </Layout>
    );
  }
}
