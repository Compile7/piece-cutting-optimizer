import { Space, Table, Tag } from 'antd';
const oneDcolumns = [
  {
    title: 'Cuts',
    dataIndex: 'cuts',
    key: 'cuts',
    // render: (text) => <a>{text}</a>,
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
  },
];

const twoDcolumns = [
    {
      title: 'Length',
      dataIndex: 'length',
      key: 'length',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Breadth',
      dataIndex: 'breadth',
      key: 'breadth',
    },
    {
        title: 'Quantity',
        dataIndex: 'qty',
        key: 'qty',
      },
  ]

const ComponentTable = ({ list, dimension }) => {

    const convertToData = (arr) => {
        let obj = [];
        let hasCuts = false;
        arr?.map((i) => {
            hasCuts = false;
            if (obj.length === 0) {
                hasCuts = true;
                dimension === "1D" ?  obj.push({
                    key: obj.length + 1,
                    cuts: i,
                    qty: 1
                }) : obj.push({
                    key: obj.length + 1,
                    length: i[0],
                    breadth: i[1],
                    qty: 1
                })
            }
            else {
                obj?.map((j) => {
                    if (j.cuts === i && dimension === "1D") {
                        j.qty = j.qty + 1;
                        hasCuts = true;
                    } else if(j.length === i[0] && j.breadth === i[1] && dimension === "2D") {
                        j.qty = j.qty + 1;
                        hasCuts = true;
                    }
                })
            }
            if(!hasCuts){
                    obj.push({
                        key: obj.length + 1,
                        cuts: i,
                        qty: 1
                    })
            }
        })
        return obj;
    }
    return(
<Table columns={dimension === "1D" ? oneDcolumns : twoDcolumns} dataSource={convertToData(list)} size="small" />
);};
export default ComponentTable;