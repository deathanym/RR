module.exports = (url) => {
  const inIndex = url.indexOf('proxy/') + 6
  const id = url.substring(inIndex).replace('/', '')
 
  return id
}
