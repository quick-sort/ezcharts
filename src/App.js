import React, { Component } from 'react';
import './App.css';
import './ezcharts/index.css';
import sample_option from './option.json'
import dataset from './dataset.json'
import EzCharts from './ezcharts'
sample_option.dataset = [{
  id: 'dataset',
  source: dataset,
  sourceHeader: true
}]

class App extends Component {
  state = {
    option: sample_option

  }
  onChange = (option) => {
    this.setState({option})
  }
  render() {
    return (
      <div className="App">
      <EzCharts option={this.state.option} onChange={this.onChange}/>
      </div>
    );
  }
}

export default App;
