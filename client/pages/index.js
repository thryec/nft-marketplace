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

const Home = () => {
    const [listedNFTs, setListedNFTs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    const fetchListedNFTs = async () => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)

        const data = await marketplaceContract.getListedItems()

        const items = await Promise.all(
            data.map(async (el) => {
                console.log(el)
                const tokenURI = await nftContract.getTokenURI(el.tokenId)
                const res = await fetch(tokenURI)
                const data = await res.json()
                console.log(data)
                let price = ethers.utils.formatUnits(el.price.toString(), 'ether')
                let item = {
                    price,
                    tokenId: el.tokenId.toNumber(),
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

    const renderNFTs = listedNFTs.map((el, i) => {
        return (
            <Card sx={{ maxWidth: 345 }} key={i}>
                <CardMedia component="img" height="140" image={el.image} alt="green iguana" />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {el.name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        )
    })

    useEffect(() => {
        fetchListedNFTs()
    }, [])

    return isLoaded ? (
        <div style={bodyStyle}>
            <Stack direction="row" spacing={2}>
                {renderNFTs}
            </Stack>
        </div>
    ) : (
        <div style={bodyStyle}>No Assets Listed</div>
    )
}

const bodyStyle = {
    margin: 40,
}

export default Home
