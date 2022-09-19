import { getImage } from '../../utils/image'

describe('getImage', () => {
  it('returns unaltered url if complete', () => {
    const uri = 'https://test.com/myimage.png'
    const fnUri = getImage(uri)
    expect(fnUri).toEqual(uri)
  })

  it('returns unaltered url if not provided', () => {
    const fnUri = getImage()
    expect(fnUri).toEqual()
  })

  it('appends IPFS gateway if not provided as part of the uri', () => {
    const uri = 'ipfs/MYHASH/myimage.png'
    const fnUri = getImage(uri)
    const expectedUri = `https://dappify.mypinata.cloud/ipfs/MYHASH/myimage.png`
    expect(fnUri).toEqual(expectedUri)
  })
})
