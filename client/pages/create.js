import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/dist/client/router'
import Web3Modal from 'web3modal'
import { create } from 'ipfs-http-client'
import { nftaddress, marketplaceaddress } from '../../config'
import NFT from '../../hardhat/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

const client = create('https://ipfs.infura.io:5001/api/v0')

const Create = () => {
    const [fileUrl, setFileUrl] = useState('')
    const [currentTokenId, setCurrentTokenId] = useState(6)
    const [itemInfo, setItemInfo] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
    })
    const [isMinted, setIsMinted] = useState(false)
    // const router = useRouter()

    const onFileUpload = async (e) => {
        const file = e.target.files[0]
        try {
            const addedFile = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
            setFileUrl(url)
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
    }

    const listOnMarketplace = async (url) => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const marketplaceContract = new ethers.Contract(marketplaceaddress, Market.abi, signer)
        const price = ethers.utils.parseUnits(itemInfo.price, 'ether')

        // list on marketplace
        console.log('listing.....')
        const listTxn = await marketplaceContract.listItemsForSale(nftaddress, currentTokenId, itemInfo.quantity, price)
        const txn = await listTxn.wait()
        // console.log('tokenId minted: ', currenttokenId)
        console.log('listing txn: ', txn)
        setFileUrl('')
        setItemInfo({
            name: '',
            description: '',
            price: '',
            quantity: '',
        })
    }

    return (
        <div style={bodyStyle}>
            <h2>Upload Your Creation Here</h2>
            <div style={inputStyle}>
                <input
                    placeholder="Item Name"
                    onChange={(e) => setItemInfo({ ...itemInfo, name: e.target.value })}
                    style={inputFields}
                />
                <textarea
                    placeholder="Item Description"
                    onChange={(e) => setItemInfo({ ...itemInfo, description: e.target.value })}
                    style={inputFields}
                />
                <input
                    placeholder="List Price"
                    onChange={(e) => setItemInfo({ ...itemInfo, price: e.target.value })}
                    style={inputFields}
                />
                <input
                    placeholder="List Quantity"
                    onChange={(e) => setItemInfo({ ...itemInfo, quantity: e.target.value })}
                    style={inputFields}
                />
                <input type="file" onChange={onFileUpload} style={inputFields} />
                {isMinted ? (
                    <Stack spacing={2} direction="row">
                        <Button onClick={createSaleItem} style={inputFields} variant="contained" disabled>
                            Mint NFT
                        </Button>
                        <Button onClick={listOnMarketplace} style={inputFields} variant="contained">
                            List NFT
                        </Button>
                    </Stack>
                ) : (
                    <Stack spacing={2} direction="row">
                        <Button onClick={createSaleItem} style={inputFields} variant="contained">
                            Mint NFT
                        </Button>
                        <Button onClick={listOnMarketplace} style={inputFields} variant="contained" disabled>
                            List NFT
                        </Button>
                    </Stack>
                )}
                <hr />
                {fileUrl && <img src={fileUrl} width="800px" />}
            </div>
        </div>
    )
}

const bodyStyle = {
    margin: 40,
}
const inputStyle = {
    display: 'flexbox',
}

const inputFields = {
    width: '750px',
    marginTop: 10,
    marginBottom: 10,
}

export default Create