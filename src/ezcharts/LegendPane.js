import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd'

export default class LegendPane extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  render() {
    const {option, onChange} = this.props
    const { legend } = option
    return <div>
      <Switch
    checkedChildren="显示图例"
    unCheckedChildren="不显示图例"
    checked={legend !== undefined}
    onChange={value => {
      if (value) {
        onChange({ '$set': {
          'legend': {
            width: '600',
            selectedMode: true,
          }
        } } )
      } else {
        onChange({ '$unset': {'legend': ''}} )
      }
    }
    }
      />
      </div>
  }
}
