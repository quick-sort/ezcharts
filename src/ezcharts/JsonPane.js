import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Drawer, Button } from 'antd'
import MonacoEditor from 'react-monaco-editor';
import { toSafeOption } from './utils'
const beautify = require("json-beautify");

export default class JsonPane extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  state = {
    drawerVisible: false
  }
  toggleDrawer = () => {
    this.setState({drawerVisible: !this.state.drawerVisible})
  }
  render() {
    const {option, onChange} = this.props
    const option2 = {
      ...option
    }
    delete option2.dataset
    return <div>
      <Button icon="code" type="primary" onClick={this.toggleDrawer} >编辑JSON</Button>
      <Drawer
        width={600}
        placement="right"
        closable={false}
        onClose={this.toggleDrawer}
        visible={this.state.drawerVisible}
      >
        <MonacoEditor
          height="600"
          language="json"
          theme="vs-dark"
          value={beautify(option2, null, 2, 30)}
          option={{
            lineNumbers: 'off',
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            minimap: {
              enabled: false
            },
            wordWrap: 'on',
            contextmenu: false,
          }}
        onChange={(text) => {
          try {
            let opt = JSON.parse(text)
            opt.dataset = option.dataset
            onChange(toSafeOption(opt))
          } catch(err) {
            message.error("JSON syntax error")
          }

        }}
        />
      </Drawer>
      </div>
  }
}
