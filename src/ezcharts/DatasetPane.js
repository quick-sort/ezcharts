import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tag, Icon, Upload, Popover } from 'antd';
const parseCSV = require('csv-parse/lib/es5/sync');
const Dragger = Upload.Dragger;

export default class DatasetPanel extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  onCsvRemove = file => {
    const { onChange, onRemove } = this.props;
    onChange({ '$pull': { dataset: { id: file.uid } } })
    if (onRemove) {
      onRemove(file.uid)
    }
  }
  onCsvUpload = file => {
    const { onChange, onUpload } = this.props;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const data = parseCSV(reader.result, {
          trim: true,
          skip_empty_lines: true,
        });
        onChange({ '$push': { dataset: { id: file.name, source: data, sourceHeader: true } } });
        if (onUpload) {
          onUpload({name: file.name, data: reader.result})
        }
      });
      if (file.name.toLowerCase().endsWith('.csv')) {
        reader.readAsText(file);
      } else {

      }

      //reader.readAsArrayBuffer(file)
      resolve('/api/upload/fake');
    });
  };
  renderItem = (i, idx) => {
    const { source } = i
    return <Popover
          placement="left"
          content={source[0].map(j => (
            <Tag key={j}>{j}</Tag>
          ))}
        >
      <Button type="primary" size="small" >
        {i.id}
      </Button>
    </Popover>
  }
  render() {
    const { option } = this.props;
    const { dataset = [] } = option
    const fileList = dataset.map((i, idx) => ({
      uid: i.id,
      name: this.renderItem(i, idx),
      status: 'done',
    }));
    return (
      <div>
        <Dragger
          action={this.onCsvUpload}
          onRemove={this.onCsvRemove}
          fileList={fileList}
        >
          <Icon type="upload" />
          上传 CSV
        </Dragger>
      </div>
    );
  }
}
