function compareByOrder(a, b, order = "asc") {
  const sorter = () => {
    return order === "desc" ? compare(a, b) : compare(b, a);
  };

  return sorter();
}

function compare(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

export { compareByOrder };
