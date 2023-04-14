import { Space, Table, Tag } from 'antd';
const columns = [
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
]

const ComponentTable = ({ list }) => {
    const convertToData = (arr) => {
        let obj = [];
        let hasCuts = false;
        arr?.map((i) => {
            hasCuts = false;
            if (obj.length === 0) {
                hasCuts = true;
                obj.push({
                    key: obj.length + 1,
                    cuts: i,
                    qty: 1
                })
            }
            else {
                obj?.map((j) => {
                    if (j.cuts === i) {
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
<Table columns={columns} dataSource={convertToData(list)} size="small" />
);};
export default ComponentTable;