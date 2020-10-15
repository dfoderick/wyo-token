import React, { useState, useEffect } from 'react'
import Computer from 'bitcoin-computer'
import './App.css'
import Card from './card'
//import Artwork from './artwork'
import CorporateToken from './CorporateToken'

function App() {
  const [seed, setSeed] = useState('')
  const [net, setNet] = useState('testnet')
  const [balance, setBalance] = useState(0)
  const [computer, setComputer] = useState(new Computer({
    seed: 'confirm civil rocket someone length siren survey face illegal ice profit light',
    chain: 'BSV',
    network: net, // testnet or livenet
  }))

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState('')
  const [agreement, setAgreement] = useState('')
  const [image, setImage] = useState('')

  const [revs, setRevs] = useState([])
  const [corporations, setCorporations] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [isupdate, setIsupdate] = useState(false)
  const [editingCorp, setEditingCorp] = useState(null)

  useEffect(() => {
    const fetchRevs = async () => {
      setBalance(await computer.db.wallet.getBalance())
      setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()))
      //setTimeout(() => setRefresh(refresh + 1), 3500)
    }
    fetchRevs()
  }, [computer.db.wallet, refresh])

  useEffect(() => {
    const fetchCorporations = async () => {
      setCorporations(await Promise.all(revs.map(async rev => computer.sync(rev))))
    }
    fetchCorporations()
  }, [revs, computer])

  useEffect(() => console.log('revs', revs), [revs])
  useEffect(() => console.log('corporations', corporations), [corporations])

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (isupdate) {
      await editingCorp.setName(name)
      await editingCorp.setSymbol(symbol)
      await editingCorp.setQuantity(quantity)
      await editingCorp.setAgreement(agreement)
      await editingCorp.setImage(image)
    } else {
      const corp = await computer.new(CorporateToken, [name, symbol, quantity, 
        agreement, image])
      console.log('created corp', corp)
    }
  }

  const loadWallet = () => {
    const computer = new Computer({
      seed: seed,
      chain: 'BSV',
      network: net, // testnet or livenet
    })
    setComputer(computer)
  }

  const select = (corp) => {
    setEditingCorp(corp)
    setName(corp.name)
    setSymbol(corp.symbol)
    setQuantity(corp.quantity)
    setAgreement(corp.agreement)
    setImage(corp.image)
    setIsupdate(true)
  }

  return (
    <div className="App">
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}<br />
      <b>Public Key</b>&nbsp;{computer.db.wallet.getPublicKey().toString()}<br />
      <b>Seed</b>&nbsp;{computer.db.wallet.mnemonic.toString()}<br />
      <b>Balance</b>&nbsp;{balance/1e8} {computer.db.wallet.restClient.chain}<br />
      Seed<br />
        <input type="string" value={seed} onChange={e => setSeed(e.target.value)} />
      Network
        <input type="radio" checked={net === "testnet"} onChange={e => setNet(e.target.checked?"testnet":"livenet")} />Testnet
        <input type="radio" checked={net === "livenet"} onChange={e => setNet(e.target.checked?"livenet":"testnet")} />Mainnet
        <br />
      <button type="submit" onClick={() => loadWallet()}>
        Load Wallet
      </button>

      <h2>Create new Token</h2>
      <form onSubmit={handleSubmit}>
        Name<br />
        <input type="string" value={name} onChange={e => setName(e.target.value)} />

        Symbol<br />
        <input type="string" value={symbol} onChange={e => setSymbol(e.target.value)} />

        Quantity<br />
        <input type="string" value={quantity} onChange={e => setQuantity(e.target.value)} />

        Operating Agreement (txid)<br />
        <input type="string" value={agreement} onChange={e => setAgreement(e.target.value)} />

        Image (txid)<br />
        <input type="string" value={image} onChange={e => setImage(e.target.value)} />

        <button type="submit" value="Send Bitcoin">Create Token</button>
        <button type="submit" value="Update Bitcoin">Update Token</button>
      </form>

      <h2>Your Companies</h2>
      <ul className="flex-container">
        {corporations.map(c => <Card corp={c} key={c.symbol} click={select} />)}
      </ul>
    </div>
  )
}

export default App
