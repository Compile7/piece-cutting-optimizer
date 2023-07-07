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

const minimumSheetParameter = (sheet) => {
    let min = {
        length: sheet?.[0]?.[0],
        breadth: sheet?.[0]?.[1]
    };
    for (let i = 0; i< sheet.length; i++){
        if(sheet[i]?.[0] < min.length) {
            min.length = sheet[i]?.[0]
        } 
        if(sheet[i]?.[1] < min.breadth) {
            min.breadth = sheet[i]?.[1]
        }
    }
    return min;
}

const FitSheetInRectangle = (sheet, stocks, finalArr, totalStock) => {
    let minLength = stocks[0];
    let minBreadth = stocks[1];
    let length = sheet[0]?.[0];
    let breadth = sheet[0]?.[1];
    let index = 0;
    let remainingArr = [];
    let usedSheet = [];
    for (let j = 0; j< sheet.length; j++) { 
        if(stocks[0] >= sheet[j]?.[0] && stocks[1] >= sheet[j]?.[1] 
            && minLength >= stocks[0] - sheet[j]?.[0] && minBreadth >= stocks[1] - sheet[j]?.[1]  ) {
                minLength = stocks[0] - sheet[j]?.[0];
                minBreadth = stocks[1] - sheet[j]?.[1];
                index = j;
                length = sheet[j]?.[0];
                breadth = sheet[j]?.[1];
                usedSheet = sheet[j];

            } else if (stocks[1] >= sheet[j]?.[0] && stocks[0] >= sheet[j]?.[1] 
                && minLength >= stocks[1] - sheet[j]?.[0] && minBreadth >= stocks[0] - sheet[j]?.[1]  ) {
                    minLength = stocks[1] - sheet[j]?.[0];
                    minBreadth = stocks[0] - sheet[j]?.[1];
                    index = j;
                    length = sheet[j]?.[1];
                    breadth = sheet[j]?.[0];
                    usedSheet = sheet[j];
                }
    }
    sheet.splice(index,1);
    let smallestSheet = minimumSheetParameter(sheet);

    let x1 = finalArr.length === 0 || (finalArr[finalArr.length - 1 ]?.[1] + length > totalStock[0] 
            && finalArr[finalArr.length - 1 ]?.[1] + breadth > totalStock[0]) ? 0 
            : finalArr[finalArr.length - 1 ]?.[1] ;
    let x2 = x1 + length;
    x1 = x2 > totalStock[0] ? 0 : x1;
    x2 =  x2 > totalStock[0] ? x1 + length : x2;

    let sameDirection = finalArr.filter((arr) => arr[0] <= x1 && arr[1] >= x2)
    let y1 = finalArr.length === 0 ? 0 : ((x1 === 0) ?  
             (sameDirection.length === 0 ? 0 : sameDirection[sameDirection.length -1]?.[3])
              : (sameDirection.length === 0 ? finalArr[finalArr.length - 1 ]?.[2] 
                 : sameDirection[sameDirection.length -1]?.[3]));

    let y2 = y1 + breadth;
    let sheetPresentInRowOrColumn = finalArr.filter((arr) => 
                ((x2 + smallestSheet.length >= arr[0] && x2 + smallestSheet.breadth <= arr[1] && 
                y1  >= arr[2] && y2 <= arr[3]) ||
                (y1 + smallestSheet.length >= arr[2] && y2 + smallestSheet.breadth <= arr[3] && 
                x1  >= arr[0] && x2 <= arr[1]) ));
    
        if(length === usedSheet[0]) {
            remainingArr[0] = stocks[0] - length < smallestSheet.length 
                                && stocks[0] - length < smallestSheet.breadth ?
                                totalStock[0] : stocks[0] - length  ;
            remainingArr[1] = totalStock[0] >= stocks[0] + smallestSheet.length ? stocks[1] - breadth : 
                                 stocks[1] ;
            if((remainingArr[0] < smallestSheet.length  || remainingArr[0] < smallestSheet.breadth) &&
                (remainingArr[1] < smallestSheet.length || remainingArr[1] < smallestSheet.breadth)){
                        remainingArr[0] = totalStock[0];
                        remainingArr[1] = stocks[1];
                       
                                    }   
            
            if(remainingArr[1] === 0 && 
                (remainingArr[0] > smallestSheet.length  || remainingArr[0] > smallestSheet.breadth) ) {
                    remainingArr[1] = stocks[1];
                }
                
                if(remainingArr[0] === 0 && 
                    (remainingArr[1] > smallestSheet.length  || remainingArr[1] > smallestSheet.breadth) ) {
                        remainingArr[0] = stocks[0];
                    }
                if(sheetPresentInRowOrColumn.length !== 0) {
                    remainingArr[0] = totalStock[0];
                    remainingArr[1] = stocks[1];
                }
                } else if(breadth === usedSheet[0]) {
            remainingArr[0] = totalStock[1] === stocks[1] ? stocks[0] - length : 
                            stocks[0] - length < smallestSheet.length ? totalStock[0] : stocks[0] ;
            remainingArr[1] = stocks[1] - breadth < smallestSheet.length 
                            || stocks[1] - breadth < smallestSheet.breadth ?
                            stocks[1] : stocks[1] - breadth  ;
        }
    let obj = {};
    obj = {
        x1,
        x2,
        y1,
        y2,
        index,
        remainingArr
    } 

    return obj;

}

const calculateAreaInArray = (arr) => {
    const area = arr.map((val) =>(val[0]) * (val[1]))
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
    for(let i = 0; (i < stocksArr.length ); i++) {
        
        // if(( usedArea ) >= sheetAreaArrLeft[0]) {
        //     console.log("up", usedArea, sheetAreaArrLeft);
        //     usedArea=usedArea;
        //     // i=i-1;
        //     // if(i != 0 && finalArr.length !== 0){
        //     //     finalArrAccToStock.push(finalArr);
        //     //     finalArr = [];
        //     // }
            
        // } else{
            remainingArr = stocksArr[i];
            lng = sheetArr.length;
            usedArea = stockAreaArr[i];
            sheetArrLeft = sheetArr;
            sheetAreaArrLeft = sheetAreaArr;
            if(i != 0) {
                finalArrAccToStock.push(finalArr);
                finalArr = [];
                
            } 
        // } 
        if(sheetArrLeft.length === 0) {
            break;
        }
        for(let j = 0; j < lng ; j++) {
           
            if(sheetAreaArrLeft[0] < (usedArea) && remainingArr.length !== 0) {
                if((j+ 1) >= lng) {
                    j = 0;
                } 
                obj =  FitSheetInRectangle(sheetArr,remainingArr, finalArr, stocksArr[i])
                
                    usedArea = usedArea - sheetAreaArrLeft[obj?.index] ;
                    remainingArr = obj?.remainingArr;
                    usedIndex = [...usedIndex, obj?.index]
                    sheetArr.splice(obj?.index,0);
                    sheetAreaArr.splice(obj?.index,1);
                    finalArr = [...finalArr,[obj?.x1, obj?.x2, obj?.y1, obj?.y2]];
            } else {
                (sheetArrLeft.length === 0 ) && finalArrAccToStock.push(finalArr)
                break;
            }
            

        }
    }
    const finalObj = { finalSheets : finalArrAccToStock, unabletofit : sheetArrLeft}
    return finalObj;

}


// console.log(pieceCutting2DAlgo([{length: 500,breadth: 200,qty: 12}, {length: 100,breadth: 200,qty: 2 }],
//      [{length: 800,breadth: 1200,qty: 1},
//         {length: 600,breadth: 800,qty: 1}  
//     ]));

module.exports = pieceCutting2DAlgo;