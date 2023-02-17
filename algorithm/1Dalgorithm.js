// function to convert array of objects to an array as we will get input in array of object[{size:20, qty:2}] => [20,20] converts to an array
const converObjectIntoArray = ( objArr) => {
    let finalArr = [];
    let Arr = []
    objArr.map((obj) => {
        Arr = Array(obj.qty).fill(obj.size)
        finalArr = [...finalArr, ...Arr]
    });
    return finalArr;
}

// function which returns the cuts(Output:- size of cut and the index of cut in array )
//  it gives the relevant cut so that we get minimum waste of pipe/rod 
//  input we give is the array for cuts and the length of pipe/rod
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



//  Main function for cut piece Algo(1D)
// Inputs 
// 1. Array of cuts [{size: 10, qty:1}]
// 2. Array of Stocks [{size: 10, qty:1}]
// Output will get of one object which contain 2 Array 
// 1. Contains subArrays for each stock 
// 2. Contains Arrays of cuts which does not fit if stock is not enough otherwise null

// Example 
// pieceCutting1DAlgo(
//     [ {size: 45, qty:1}, {size: 25, qty:1}, {size: 20, qty:3}, {size: 15, qty:2}, {size: 35, qty:1} ],
//      [{size: 89, qty:2}]
// );
// Output:-
// {
//     finalCuts: [ [ 0, 45, 80 ], [ 0, 25, 45, 65, 85 ] ],
//     unabletofit: [ 15, 15 ]
//   }
export const pieceCutting1DAlgo = (cuts, stocks) => {
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
            
            //for the creation of subArray 

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

    const finalObject = {
        finalCuts,
        unabletofit:cutsLeft
    }
    return finalObject;

}