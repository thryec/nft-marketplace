import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/dist/client/router'
import Web3Modal from 'web3modal'
import { create } from 'ipfs-http-client'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../contract-abis/NFT.json'
import Market from '../contract-abis/Marketplace.json'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'

const client = create('https://ipfs.infura.io:5001/api/v0')

const Create = () => {
    const [fileUrl, setFileUrl] = useState('')
    const [currentTokenId, setCurrentTokenId] = useState(0)
    const [itemInfo, setItemInfo] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
    })
    const [isMinted, setIsMinted] = useState(false)
    const [fileUploading, setFileUploading] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const onFileUpload = async (e) => {
        setFileUploading(true)
        const file = e.target.files[0]
        try {
            const addedFile = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
            setFileUrl(url)
            setFileUploading(false)
        } catch (e) {
            console.log('Error uploading file: ', e)
        }
    }

    const createSaleItem = async () => {
        const { name, description, price, quantity } = itemInfo
        if (!name || !description || !price || !quantity || !fileUrl) {
            alert('Please do not leave any fields blank.')
            return
        }
        const data = JSON.stringify({ name, description, image: fileUrl })
        try {
            const addedFile = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
            console.log('image successfully uploaded to IPFS at url: ', url)
            mintNFT(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const mintNFT = async (url) => {
        setIsPending(true)
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        console.log('minting.....')
        const mintTxn = await nftContract.mintToken(url, itemInfo.quantity, '0x00')
        const txn = await mintTxn.wait()
        console.log('mintTxn: ', txn)

        const id = await txn.events[0].args[3]
        console.log('tokenId: ', id)

        setCurrentTokenId(id)
        setIsMinted(true)
        setIsPending(false)
    }

    const listOnMarketplace = async (url) => {
        setIsPending(true)
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)
        const price = ethers.utils.parseUnits(itemInfo.price, 'ether')

        console.log('listing.....')
        const listTxn = await marketplaceContract.listItemsForSale(nftaddress, currentTokenId, itemInfo.quantity, price)
        const txn = await listTxn.wait()

        console.log('listing txn: ', txn)
        setFileUrl('')
        setItemInfo({
            name: '',
            description: '',
            price: '',
            quantity: '',
        })
        setIsPending(false)
        router.push('/')
    }

    return (
        <div style={bodyStyle}>
            <div>
                <h2>Mint Your Creation Here</h2>
                <Box
                    component="form"
                    autoComplete="off"
                    m="auto"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '70ch' },
                    }}
                >
                    <Stack spacing={2} direction="column">
                        <TextField onChange={(e) => setItemInfo({ ...itemInfo, name: e.target.value })} label="Item Name" />
                        <TextField onChange={(e) => setItemInfo({ ...itemInfo, description: e.target.value })} label="Item Description" />
                        <TextField label="List Price" onChange={(e) => setItemInfo({ ...itemInfo, price: e.target.value })} />
                        <TextField label="List Quantity" onChange={(e) => setItemInfo({ ...itemInfo, quantity: e.target.value })} />
                    </Stack>
                </Box>
                <Button variant="outlined" component="label" style={{ margin: '20px auto' }}>
                    Upload File
                    <input type="file" hidden onChange={onFileUpload} />
                </Button>
                {isMinted ? (
                    <Stack spacing={2} direction="row">
                        <Button onClick={createSaleItem} variant="contained" disabled>
                            Mint Tokens
                        </Button>
                        <Button onClick={listOnMarketplace} variant="contained">
                            List Tokens
                        </Button>
                    </Stack>
                ) : (
                    <Stack spacing={5} direction="row" style={{ marginBottom: '20px' }}>
                        <Button onClick={createSaleItem} variant="contained">
                            Mint Tokens
                        </Button>
                        <Button onClick={listOnMarketplace} variant="contained" disabled>
                            List Tokens
                        </Button>
                    </Stack>
                )}
            </div>
            {isPending && (
                <div>
                    <p>Please wait while your transaction is being mined...</p>
                    <CircularProgress />
                </div>
            )}
            <hr />
            <div style={{ margin: '20px' }}>
                {fileUploading ? <LinearProgress sx={{ width: '80%' }} /> : <img src={fileUrl} width="800px" />}
            </div>
        </div>
    )
}

const bodyStyle = {
    marginTop: 50,
    marginLeft: 150,
    marginRight: 150,
}

export default Create
