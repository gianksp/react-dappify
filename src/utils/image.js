export const getImage = (url) => {
  if (!url) return url
  if (!url.includes('ipfs/')) return url
  const components = url.split('ipfs/')
  const base = 'https://dappify.mypinata.cloud/ipfs/'
  const suffix = components[components.length - 1]
  const destination = `${base}${suffix}`
  return destination
}

export const getImageHash = (url) => {
  if (!url) return url
  if (!url.includes('ipfs/')) return url
  const components = url.split('/')
  const destination = `ipfs/${components[components.length - 1]}`
  return destination
}
