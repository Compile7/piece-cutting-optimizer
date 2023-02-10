const converObjectIntoArray = ( objArr) => {
    let finalArr = [];
    let Arr = []
    objArr.map((obj) => {
        Arr = Array(obj.qty).fill(obj.size)
        finalArr = [...finalArr, ...Arr]
    });
    return finalArr;
}

const cutsinSinglePipe = (arr, rodLength) => {
    let min = rodLength; 
    let cut = 0;
    let index = 0;
    for (let j in arr) {
        if(rodLength >= arr[j] && min >= rodLength-arr[j] ){

            min = rodLength-arr[j];
            cut = arr[j];
            index = j;
        } 

    }
    const obj = {cut, index}
    return obj;
}




const pieceCuttingAlgo = (cuts, stocks) => {
    let finalCuts =[];
    let totalSize = 0;
    let cutsInEachPipe = [0]; 
    let totalCutInEachPipe = 0;
    let cutsArr = converObjectIntoArray(cuts);
    let stocksArr = converObjectIntoArray(stocks);
    
    let cutsLeft = cutsArr;
    for (let i =0; i <= (stocksArr.length); i++ ) {

        if(totalSize >= cutsLeft[0]) {
            totalSize=totalSize;
            i=i-1;
            
        } else{
            totalSize = stocksArr[i] 
            totalCutInEachPipe = 0;
            cutsArr = cutsLeft;
            
            if(i!=0){
                finalCuts.push(cutsInEachPipe)
                cutsInEachPipe = [0]
            }
        }


        for (let j =0; j <= cutsArr.length; j++ ) {
            if(totalSize >= cutsArr[j]){
                
                obj = cutsinSinglePipe(cutsLeft, totalSize);
                totalCutInEachPipe = totalCutInEachPipe + obj.cut;
                cutsLeft.splice(obj.index,1);
                cutsInEachPipe = [...cutsInEachPipe, totalCutInEachPipe]
                totalSize = totalSize-obj.cut;
            } 
           
        }
    }
    let unabletofit = [] 

    const finalObject = {
        finalCuts,
        unabletofit:cutsLeft
    }
    return finalObject;

}
// console.log(pieceCuttingAlgo(
//     [
//         {size: 45, qty:1},
//         {size: 25, qty:1},
//         {size: 20, qty:3},
//         {size: 15, qty:2},
//         {size: 35, qty:1}]
//     , [{size: 89, qty:3}]));
