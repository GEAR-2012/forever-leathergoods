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
