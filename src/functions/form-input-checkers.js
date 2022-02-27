// input field checker functions they are used
// individually 'onBlur' OR collectively with 'formChecker' function at 'onSubmit'
// those return possible error messages & filtered values
// if no error is found return an empty string as error & the filtered value
// these returns go to 'value' & 'error' local states

import { regExpUrl } from "../reg-exp";

// general error messages:
const errorRequired = "This field is required";

// category
export const chkCategory = (inputValue) => {
  let err = "";
  const val = inputValue.trim();
  if (!val) err = errorRequired;
  return { val, err };
};

// name
export const chkName = (inputValue) => {
  let err = "";
  const val = inputValue.trim();
  if (!val) err = errorRequired;
  if (val.length < 3 || val.length > 100) err = "This value should contain 3 - 100 characther";
  return { val, err };
};

// description
export const chkDescription = (inputValue) => {
  let err = "";
  const val = inputValue.trim();
  // if (!val) err = errorRequired;
  if (val.length > 0 && (val.length < 30 || val.length > 1000))
    err = "This value should contain 30 - 1000 characters or omit";
  return { val, err };
};

// one specification
export const chkSpecification = (inputValue) => {
  // convert to string & trim the input value
  let val = inputValue.toString().trim();

  if (!val) {
    // switch it back if all specification is must have
    // return { val, err: "Please select one option" };
  }

  // if the string value can convert to number & not empty string
  if (!isNaN(val) && val !== "") {
    val = Number(val);
  }

  return { val, err: "" };
};

// price
export const chkPrice = (inputValue) => {
  // trim the input value
  let val = inputValue.toString().trim();

  // if no input value
  if (!val) {
    return { val, err: errorRequired };
  }

  // if input value not a number
  if (isNaN(val)) {
    return { val, err: "The 'Price' sould be a number" };
  }

  // if it is number------:

  // round to two decimals
  const decimals = 2;
  const pow = Math.pow(10, decimals);
  val = Math.round(val * pow) / pow;

  // convert to absolute value
  val = Math.abs(val);

  // check for price format
  if (val === 0 || val > 1000) {
    return { val, err: "This value should fall between 0 & 1000" };
  }

  return { val, err: "" };
};

// purchase link (url)
export const chkPurchaseLink = (inputValue) => {
  // regExpUrl
  const val = inputValue.trim();
  if (!val) {
    return { val, err: errorRequired };
  }
  if (!regExpUrl.test(val)) {
    return { val, err: "Please enter a valid url" };
  }
  return { val, err: "" };
};
