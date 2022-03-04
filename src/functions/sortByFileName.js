const sortByFileName = (picList) => {
  const sortedList = [...picList];
  sortedList.sort((a, b) => {
    const nameA = a.name.toUpperCase().split("___")[0];
    const nameB = b.name.toUpperCase().split("___")[0];

    return nameA.localeCompare(nameB, "en", { numeric: true, sensitivity: "base" });
  });
  return sortedList;
};

export default sortByFileName;
