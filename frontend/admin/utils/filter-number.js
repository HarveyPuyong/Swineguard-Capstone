function filteredNumber(num){
  if (Number.isInteger(num)) {
    return num;
  } else {
    return parseFloat(num.toFixed(2));
  }
}

export default filteredNumber;