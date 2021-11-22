import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/dist/client/router'
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
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const myGallery = () => {
    const [myNFTs, setMyNFTs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const [listPrice, setListPrice] = useState(0)
    const router = useRouter()

    const fetchMyNFTs = async () => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)

        const data = await marketplaceContract.getItemsOwned()

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
        setMyNFTs(items)
        setIsLoaded(true)
    }

    const listItem = async (nft) => {
        if (isNaN(listPrice)) {
            alert('Please input an integer value as the price')
        } else {
            const web3modal = new Web3Modal()
            const connection = await web3modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()

            const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
            const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)
            console.log(signer)
            const balance = await nftContract.balanceOf(signer.address, nft.tokenId)
            console.log('signer token balance: ', balance)

            // console.log('listing token with Id ', nft.tokenId)
            // const listing = await marketplaceContract.listItemsForSale(nftaddress, nft.tokenId, 1, listPrice)
            // const txn = await listing.wait()
            // console.log('txn receipt: ', txn)
        }
    }

    const renderNFTs = myNFTs.map((el, i) => {
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
                    <Button
                        onClick={() => {
                            setModalActive(true)
                        }}
                        size="small"
                    >
                        Sell
                    </Button>
                </CardActions>
                <Modal
                    open={modalActive}
                    onClose={() => {
                        setModalActive(false)
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={bgStyle}
                >
                    <Box sx={modalStyle}>
                        <Stack direction="column" spacing={7}>
                            <Typography id="modal-modal-title" variant="h4">
                                Enter List Price
                            </Typography>
                            <TextField
                                onChange={(e) => {
                                    setListPrice(e.target.value)
                                }}
                                label="Sale Price"
                            />
                            <Button
                                onClick={() => {
                                    listItem(el)
                                }}
                                variant="contained"
                            >
                                List on Marketplace
                            </Button>
                        </Stack>
                    </Box>
                </Modal>
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

    // useEffect(() => {
    //     fetchMyNFTs()
    // }, [])

    return isLoaded ? (
        <div style={bodyStyle}>
            <Stack direction="row" spacing={2}>
                {renderNFTs}
            </Stack>
        </div>
    ) : (
        <div style={bodyStyle}>
            <Button onClick={fetchMyNFTs} variant="contained">
                Connect Wallet
            </Button>
        </div>
    )
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 400,
    backgroundColor: 'background.paper',
    border: '3px solid #aaa',
    borderRadius: '5%',
    boxShadow: 24,
    p: 4,
}

const bgStyle = {
    backgroundColor: '#ffffff',
    // opacity: 0.35,
}

const bodyStyle = {
    margin: 40,
}

export default myGallery
