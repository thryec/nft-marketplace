import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const myGallery = () => {
    const [myNFTs, setMyNFTs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    const fetchMyNFTs = async () => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)

        const data = await marketplaceContract.getItemsOwned()
        // console.log('my items: ', data)

        const items = await Promise.all(
            data.map(async (el) => {
                const tokenURI = await nftContract.getTokenURI(el.tokenId)
                const res = await fetch(tokenURI)
                const data = await res.json()
                let price = ethers.utils.formatUnits(el.price.toString(), 'ether')
                let item = {
                    price,
                    tokenId: el.tokenId.toNumber(),
                    seller: el.seller,
                    owner: el.owner,
                    listed: el.isListed,
                    image: data.image,
                }
                return item
            })
        )
        setMyNFTs(items)
        setIsLoaded(true)
    }

    const renderNFTs = myNFTs.map((el, i) => {
        return (
            <Card sx={{ maxWidth: 345 }} key={i}>
                <CardMedia component="img" height="140" image={el.image} alt="green iguana" />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        )
    })

    const render = myNFTs.map((el, i) => {
        return (
            <div key={i}>
                <img src={el.image} />
                <p>{el.price} ETH</p>
            </div>
        )
    })

    const showItems = () => {
        console.log(myNFTs)
    }

    useEffect(() => {
        fetchMyNFTs()
    }, [])

    return isLoaded ? (
        <div style={bodyStyle}>
            <Button onClick={showItems}>log items</Button>
            <Stack direction="row" spacing={2}>
                {renderNFTs}
            </Stack>
        </div>
    ) : (
        <div style={bodyStyle}>No Assets Owned</div>
    )
}
const bodyStyle = {
    margin: 40,
}

export default myGallery
