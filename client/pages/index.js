import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import Web3Modal from 'web3modal'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../contract-abis/NFT.json'
import Market from '../contract-abis/Marketplace.json'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const Home = () => {
    const [listedNFTs, setListedNFTs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const fetchListedNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://eth-rinkeby.alchemyapi.io/v2/3oLAthVbgYWuW57KqOR_HQaglc7jDAfZ')
        const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, provider)

        const data = await marketplaceContract.getListedItems()
        const items = await Promise.all(
            data.map(async (el) => {
                const tokenURI = await nftContract.getTokenURI(el.tokenId)
                const res = await fetch(tokenURI)
                const data = await res.json()
                let price = ethers.utils.formatUnits(el.price.toString(), 'ether')
                let item = {
                    price,
                    tokenId: el.tokenId.toNumber(),
                    itemId: el.itemId.toNumber(),
                    seller: el.seller,
                    owner: el.owner,
                    listed: el.isListed,
                    image: data.image,
                    name: data.name,
                    description: data.description,
                }
                return item
            })
        )
        setListedNFTs(items)
        setIsLoaded(true)
    }

    const buyNFT = async (el) => {
        setIsPending(true)
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketplaceaddress, Market.abi, signer)
        const price = ethers.utils.parseUnits(el.price.toString(), 'ether')

        console.log('buying.... ', el)
        const txn = await contract.purchaseItem(nftaddress, el.itemId, { value: price })
        const receipt = await txn.wait()
        console.log('item purchased: ', receipt)
        setIsPending(false)
        router.push('/gallery')
    }

    const renderNFTs = listedNFTs.map((el, i) => {
        return (
            <Card sx={{ width: 275 }} key={i}>
                <CardMedia component="img" height="300" image={el.image} alt="green iguana" />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {el.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {el.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Stack direction="row" spacing={14}>
                        <Button onClick={() => buyNFT(el)} size="small" variant="outlined">
                            Buy
                        </Button>
                        <Typography variant="h6">{el.price} ETH</Typography>
                    </Stack>
                </CardActions>
            </Card>
        )
    })

    useEffect(() => {
        fetchListedNFTs()
    }, [])

    return isLoaded ? (
        <div style={bodyStyle}>
            {listedNFTs.length === 0 ? (
                <p>No Items Listed </p>
            ) : (
                <Stack direction="row" spacing={2}>
                    {renderNFTs}
                </Stack>
            )}
            {isPending && (
                <div style={{ marginTop: 50 }}>
                    <p>Please wait while your transaction is being mined...</p>
                    <CircularProgress />
                </div>
            )}
        </div>
    ) : (
        <div style={bodyStyle}>Loading....</div>
    )
}

const bodyStyle = {
    margin: 50,
}

export default Home
