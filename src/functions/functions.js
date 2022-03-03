export const checkOrientation = () => {
  let toReturn;
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (h > w) {
    toReturn = true;
  } else {
    toReturn = false;
  }
  return toReturn;
};

export const comaSepStringToArray = (str) => {
  // break up the string
  let arr = str.split(",");

  // clean each item
  arr = arr.map((item) => item.trim());

  // convert string input items
  arr = arr.map((item) => {
    if (item === "true") {
      return true;
    } else if (item === "false") {
      return false;
    } else if (isNaN(item)) {
      return item;
    } else if (!isNaN(item)) {
      return Number(item);
    } else {
      return item;
    }
  });

  // sort the array
  arr = arr.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  // making all value in the array unique
  const uniqueValuesObj = new Set(arr);

  // spread all values from the 'uniqueValuesObj' back into 'arr'
  arr = [...uniqueValuesObj];

  return arr;
};

export const cutFileExtension = (fileName) => {
  const posOfLastDot = fileName.lastIndexOf(".");
  const trimmedFileName = fileName.slice(0, posOfLastDot);
  return trimmedFileName;
};
