module.exports = (arr, reg) => {
  const found = arr.find((item, index) => {
    return reg.test(item.toLowerCase())
  })
  return arr.indexOf(found)
}