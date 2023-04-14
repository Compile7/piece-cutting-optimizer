import { Dropdown, Space, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import "./componentHeader.css"
import {
  SettingFilled,
  CaretDownFilled
} from '@ant-design/icons';
// import Html2Pdf from 'js-html2pdf';


const ComponentHeader = (props) => {
  const {heading, endIcon, menuItems} = props;
  // const printDocument = () => {
  //   const element = document.querySelector('.canvas-div');
  //   var options = {
  //     filename: 'my-file.pdf',
  //     image:        { type: 'jpeg', quality: 0.98 },
  // html2canvas:  { scale: 5, logging: true, dpi: 192, letterRendering: true },
  // jsPDF:        { unit: 'mm', format: 'a1', orientation: 'portrait' }
  //   };
  //   options.source = element;
  //   options.download = true;
  //   Html2Pdf.getPdf(options);
  // }
  const onClick = ({ key }) => {
    if(key === "1"){
      // printDocument();
    }
    // message.info(`Click on item ${key}`);
  };
  const menuProps = {
    items: menuItems,
    onClick: onClick,
  };
  return (
    <div className="canvas-header" >
      <Typography className="heading">
        {heading}
      </Typography>
      {endIcon === "setting" && menuItems.length > 0 && 
       <Dropdown menu={menuProps} placement="bottomRight">
        <Space>
        <SettingFilled className="end-icon" />
        </Space>
        </Dropdown>
        }
      {endIcon === "downArrow" && <CaretDownFilled className="end-icon" />}
    </div>
  );
};

export default ComponentHeader;
