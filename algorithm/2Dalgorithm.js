// [{length, breadth, quantity, label},...]
//[]

const converObjectIntoArray = (objArr) => {
    let finalArr = [];
    let Arr = []
    objArr.map((obj) => {
        Arr = Array(obj.qty).fill([obj.length,obj.breadth])
        finalArr = [...finalArr, ...Arr]
    });
    return finalArr;
}
// [[200, 300]] ,[[500,300],[500,300]....]
const FitInSingleSheet = (sheet, stocks, finalArr, totalStock) => {
    let minLength = stocks[0];
    let minBreadth = stocks[1]; 
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    let duplicate = [] ;
    let length = finalArr.length === 0 || 
    finalArr[finalArr.length-1]?.[1] == totalStock[0] ? 0 : finalArr[finalArr.length-1]?.[1];
    
    
    let breadth = finalArr.length === 0 || 
    finalArr[finalArr.length-1]?.[3] == totalStock[0]?  0 : finalArr[finalArr.length-1]?.[3];
    let index = 0;
    let remainingArr = [];
    console.log(finalArr,"stocks", stocks,"total", totalStock, "breadth", breadth, );
    for (let j in sheet) {
        if(stocks[0] >= sheet[j][0] && stocks[1] >= sheet[j][1] &&
            minLength >= stocks[0]-sheet[j][0] && minBreadth >= stocks[1]-sheet[j][1]  ){
            minLength = stocks[0]-sheet[j][0];
            minBreadth = stocks[1]-sheet[j][1];
            x1 = finalArr.length === 0 || finalArr[finalArr.length-1][1] === totalStock[0] ? 0 : 
                finalArr[finalArr.length-1]?.[1];
            x2 = (finalArr.length === 0 ? 0 : finalArr[finalArr.length-1][1] === totalStock[0] ? 0 : 
                finalArr[finalArr.length-1]?.[1]) + 
                (totalStock[0] >= length + sheet[j][0] ? sheet[j][0] : 0);
            y1 = finalArr.length === 0  ? 0 : finalArr[finalArr.length-1][1] !== totalStock[0] ? 
                finalArr[finalArr.length-1][2] : finalArr[finalArr.length-1]?.[3];
            y2 = (finalArr.length === 0 ? 0 : 
                // finalArr[finalArr.length-1][1] !== totalStock[0] ? finalArr[finalArr.length-1][3] : 
                finalArr[finalArr.length-1]?.[3]) + 
                (totalStock[1] >= breadth + sheet[j][1] && 
                    (!finalArr[finalArr.length-1]?.[3] || 
                        finalArr[finalArr.length-1]?.[1] === totalStock[0] 
                    ) ? sheet[j][1] : 0);
            index = j;
            remainingArr = [stocks[0] - sheet[j][0] === 0 || finalArr[finalArr.length]?.[1]? stocks[0] : stocks[0] - sheet[j][0],
             stocks[1] - sheet[j][1] === 0 ? stocks[1] : stocks[1] - sheet[j][1] ]


        } else  if((stocks[0] >= sheet[j][1] || stocks[1] >= sheet[j][0]) &&
           minLength >= stocks[0]-sheet[j][1] && minBreadth >= stocks[1]-sheet[j][0] ){
           minLength = stocks[0]-sheet[j][1];
           minBreadth = stocks[1]-sheet[j][0];
           x1 = finalArr.length === 0 || 
                (finalArr[finalArr.length-1][1] + sheet[j][1]) >= totalStock[0] ? 0 : 
                finalArr[finalArr.length-1]?.[1];

           x2 = (finalArr.length === 0 ? 0 : (finalArr[finalArr.length-1][1] + sheet[j][1]) >= totalStock[0] ? 
                0 : finalArr[finalArr.length-1]?.[1]) + sheet[j][1];

           y1 = finalArr.length === 0  || 
                finalArr[finalArr.length-1][1] === totalStock[0] ? 0 : 
                finalArr[finalArr.length-1][1] !== totalStock[0] ? 
                finalArr[finalArr.length-1][2] : finalArr[finalArr.length-1]?.[3];

            y2 = (finalArr.length === 0 ? 0 : 
                finalArr[finalArr.length-1][3] <= totalStock[1] ? 0 : 
                finalArr[finalArr.length-1]?.[3]) + 
                (totalStock[1] >= breadth + sheet[j][0] || 
                    (!finalArr[finalArr.length-1]?.[3] || 
                        finalArr[finalArr.length-1]?.[3] <= totalStock[1] 
                    ) ? sheet[j][0] : 0);
                    
                    //    y2 = (finalArr.length === 0 ? 0 : finalArr[finalArr.length-1]?.[3]) + 
                    //    (totalStock[1] >= breadth + sheet[j][0] ? sheet[j][0] : 0);
                    index = j;
                    remainingArr = [stocks[0] - sheet[j][1] === 0 ? stocks[0] : stocks[0] - sheet[j][1],
                    stocks[1] - sheet[j][0] === 0 ? stocks[1] : stocks[1] - sheet[j][0] ]
                }
            }
            duplicate =  finalArr.filter((arr) => arr[0] === x1 && arr[1] === x2 && arr[2] === y1 && arr[3] === y2)
    let obj = {} ;
    if(duplicate.length === 0) {
         obj = {x1, x2, y1, y2, remainingArr, index}
         
        } 
        return obj;
    }



const calculateAreaInArray = (arr) => {
    // console.log(arr);
    const area = arr.map((val) =>(+val[0]) * (+val[1]))
    return area;
}

const pieceCutting2DAlgo = (sheets, stocks) => { 
    const sheetArr = converObjectIntoArray(sheets);
    const stocksArr = converObjectIntoArray(stocks);

    const sheetAreaArr = calculateAreaInArray(sheetArr);
    const stockAreaArr = calculateAreaInArray(stocksArr);
    let finalArr = [];
    let remainingArr = [];
    let sheetArrLeft = [];
    let sheetAreaArrLeft = [];
    let usedArea = 0;
    let obj; 
    let finalArrAccToStock = [];
    let lng = 0;
    let usedIndex = [];
    sheetArrLeft = sheetArr;
    sheetAreaArrLeft = sheetAreaArr;
    
    for(let i = 0; i <= stocksArr.length; i++) {
        if(usedArea >= sheetAreaArrLeft[0]) {
            usedArea=usedArea;
            i=i-1;
            
        } else{
            remainingArr = stocksArr[i];
            lng = sheetArr.length;
            usedArea = stockAreaArr[i];
            sheetArrLeft = sheetArr;
            sheetAreaArrLeft = sheetAreaArr;
            if(i != 0) {
                finalArrAccToStock.push(finalArr.filter((arr) => arr[0] !== undefined));
                finalArr = [];
                
            } 
        } 
        if(sheetAreaArr.length === 0) {
            break;
        }

        
        for(let j = 0; j < lng; j++) {
            if(sheetAreaArrLeft[j] <= (usedArea) && remainingArr.length != 0) {
                obj =  FitInSingleSheet(sheetArr,remainingArr, finalArr, stocksArr[i])
                    usedArea = usedArea - sheetAreaArrLeft[obj?.index] ;
                    remainingArr = obj?.remainingArr;
                    usedIndex = [...usedIndex, obj?.index]
                    sheetArr.splice(obj?.index,1);
                    sheetAreaArr.splice(obj?.index,1);
                    finalArr = [...finalArr,[obj?.x1, obj?.x2, obj?.y1, obj?.y2]]
            }

        }
    }
    return finalArrAccToStock;

}

// console.log(pieceCutting2DAlgo([{length: 200,breadth: 300,qty: 7}], [{length: 500,breadth: 300,qty: 4}]));

console.log(pieceCutting2DAlgo([{length: 500,breadth: 200,qty: 12}], [{length: 1100,breadth: 800,qty: 12}]));

module.exports = pieceCutting2DAlgo;