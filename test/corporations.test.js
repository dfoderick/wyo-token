import Computer from 'bitcoin-computer'

test('should not access mainnet from testnet', async () => {
    const computer = new Computer({
        seed: 'confirm civil rocket someone length siren survey face illegal ice profit light',
        chain: 'BSV',
        network: 'livenet', // testnet or livenet
      })
    console.log(computer.db.wallet.getAddress().toString())
    const revs = await computer.getOwnedRevs()
    console.log(revs)
    
})