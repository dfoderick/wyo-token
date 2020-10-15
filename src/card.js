import './card.css'
import React from 'react'

export default ({ corp, click }) => {
  const handleClick = () => {
    // const publicKey = prompt("Please enter the public key of the new owner")
    // if(publicKey) corp.setOwner(publicKey)
    click(corp)
  }

  return corp
    ? (<div className="card" onClick={handleClick}>
        <img src={`https://bico.media/${corp.image}`} alt={corp.name} />
        <div className="container">
          <b>{corp.name}</b><br />
          {corp.symbol}<br />
          {corp.quantity}<br />
        </div>
      </div>)
    : <div></div>
}
