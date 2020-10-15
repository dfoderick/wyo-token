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
    seed: 'lemon purity fragile glide boss you bright basic cube ordinary salon behind',
    chain: 'BSV',
    network: net,
  }))

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState('')
  const [agreement, setAgreement] = useState('')
  const [image, setImage] = useState('')

  const [revs, setRevs] = useState([])
  const [corporations, setCorporations] = useState([])
  const [refresh, setRefresh] = useState(0)
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
    const fetchRev = async (rev) => computer.sync(rev)
    const fetchCorporations = async () => {
      // const corps = await Promise.all(
      //   revs.map(await fetchRev)
      // )
      const corps = []
      for(let i =0; i< revs.length; i++) {
        try {
          corps.push(await fetchRev(revs[i]))
          console.log(`synced ${revs[i]}`)
        } catch (err) {
          console.error(`Error syncing rev ${revs[i]}`)
          console.error(err)
        }
      }
      setCorporations(corps)
    }
    fetchCorporations()
  }, [revs, computer])

  useEffect(() => console.log('revs', revs), [revs])
  useEffect(() => console.log('corporations', corporations), [corporations])

  const addToken = async () => {
    const corp = await computer.new(CorporateToken, [
      computer.db.wallet.getPublicKey().toString(),
      name, symbol, quantity,
      agreement, image])
    console.log('created corp', corp)
    clearForm()
    setRefresh(refresh + 1)
  }

  const updateToken = async () => {
      console.log(`editing token`)
      if (editingCorp) {
        await editingCorp.setName(name)
        await editingCorp.setSymbol(symbol)
        await editingCorp.setQuantity(quantity)
        await editingCorp.setAgreement(agreement)
        await editingCorp.setImage(image)
      }
      setRefresh(refresh + 1)
  }

  const loadWallet = () => {
    const comp = new Computer({
      seed: seed,
      chain: 'BSV',
      network: net, // testnet or livenet
    })
    setComputer(comp)
  }

  const refreshWallet = async () => {
    const comp = new Computer({
      seed: computer.db.wallet.getMnemonic().toString(),
      chain: 'BSV', network: net,
    })
    setComputer(comp)
  }

  const clearForm = () => {
    setName('')
    setSymbol('')
    setQuantity('')
    setAgreement('')
    setImage('')
  }

  const select = (corp) => {
    setEditingCorp(corp)
    setName(corp.name || '')
    setSymbol(corp.symbol || '')
    setQuantity(corp.quantity || '')
    setAgreement(corp.agreement || '')
    setImage(corp.image || '')
    setRefresh(refresh + 1)
  }

  return (
    <div className="App">
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress().toString()}<br />
      <b>Public Key</b>&nbsp;{computer.db.wallet.getPublicKey().toString()}<br />
      <b>Seed</b>&nbsp;{computer.db.wallet.mnemonic.toString()}<br />
      <b>Balance</b>&nbsp;{balance/1e8} {computer.db.wallet.restClient.chain}
      <a target="_blank" href="https://faucet.bitcoincloud.net/" rel="noopener noreferrer"> Get testnet coins</a>
      <br />
      Seed<br />
        <input type="string" value={seed} onChange={e => setSeed(e.target.value)} />
      Network
        <input type="radio" checked={net === "testnet"} onChange={e => setNet(e.target.checked?"testnet":"livenet")} />Testnet
        <input type="radio" checked={net === "livenet"} onChange={e => setNet(e.target.checked?"livenet":"testnet")} />Mainnet
        <br />
      <button type="submit" onClick={() => loadWallet()}>
        Load Wallet
      </button>
      &nbsp;
      <button onClick={() => refreshWallet()}>
        Refresh Wallet
      </button>

      <h2>Create/Update Token</h2>
      <div>
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

        <button onClick={() => addToken()} value="Send Bitcoin">Create Token</button>
        &nbsp;
        <button onClick={() => updateToken()} value="Update Bitcoin">Update Token</button>
      </div>

      <h2>Your Companies</h2>
      <ul className="flex-container">
      {corporations.filter(c=>c!=undefined).map(c => <Card corp={c} key={c?c.symbol:''} click={select} />)}
      </ul>
    </div>
  )
}

export default App
