import React from 'react';
import { DownloadOutlined, ClearOutlined } from '@ant-design/icons';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

const { confirm } = Modal;

export const SettingsItems = [
    // {
    //   label: 'Download(pdf)',
    //   key: '1',
    //   icon: <DownloadOutlined />,
    // },
    {
      label: 'Clear Canvas',
      key: "2",
      icon: <ClearOutlined />,
    },
    
  ];

export const ShowDeleteConfirm = (Confirmfn, Cancelfn) => {
    confirm({
    title: 'Are you sure you want to continue',
    icon: <ExclamationCircleFilled />,
    content: 'Stocks length is less than the cuts provided',
    onOk() {
     Confirmfn();
    },
    onCancel() {
      Cancelfn();
    },
  });
}

