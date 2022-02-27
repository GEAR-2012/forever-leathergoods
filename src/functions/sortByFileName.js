const sortByFileName = (picList) => {
  const sortedList = [...picList];
  sortedList.sort((a, b) => {
    const nameA = a.name.toUpperCase().split("___")[0];
    const nameB = b.name.toUpperCase().split("___")[0];
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  return sortedList;
};

export default sortByFileName;
