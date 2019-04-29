import React, { Component } from 'react';
import { Input, Divider, Layout } from 'antd';
import ReactEcharts from 'echarts-for-react';
import mongobj from 'mongobj';
import { toSafeOption } from './utils'
import DatasetPane from './DatasetPane';
import CoordinatePane from './CoordinatePane';
import SeriesPane from './SeriesPane';
import JsonPane from './JsonPane'

const { Content, Sider }  = Layout
export default class EzCharts extends Component {
  static propTypes = {};
  static getDerivedStateFromProps(props, state) {
    const { option } = props;
    if (option) {
      return {option}
    } else {
      return state;
    }
  }
  constructor(props) {
    super(props);
    const { defaultOption = {}, option = {} } = props;
    this.state = {
      option: {
        ...defaultOption,
        ...option
      },
    };
  }
  onReplace = (option) => {
    this.setState({option})
    if (this.props.onChange) {
      this.props.onChange(option);
    }
  }
  onChange = (changes, changesOpt) => {
    const { option } = this.state;
    const newOption = mongobj.update({ ...option }, changes, changesOpt);
    this.setState({ option: newOption });
    if (this.props.onChange) {
      this.props.onChange(newOption);
    }
  };
  onChangeTitle = (evt) => {
    this.onChange({'$set': {'title.text': evt.target.value}})
  };
  render() {
    const { option } = this.state;
    const { title = {} } = option
    const { style = {height: 600}, onEvents = {}, onCsvUpload, onCsvRemove } = this.props

    return (
      <Layout className="ezcharts">
        <Layout>
          <Content>
            <ReactEcharts option={toSafeOption(option)} onEvents={onEvents} notMerge style={style} />
          </Content>
        </Layout>
        <Sider className="ezcharts-panel" theme="light" width={220} >
          <Input
            value={title.text}
            placeholder="图表名称"
            style={{width: 200}}
            onChange={this.onChangeTitle}
          />
          <Divider />
          <DatasetPane option={option} onChange={this.onChange} onRemove={onCsvRemove} onUpload={onCsvUpload} />
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
