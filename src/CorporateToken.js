export default class CorporateToken {
    constructor(purchaser, name, symbol, quantity, 
        agreement, image) {
      this._owners = [purchaser]
      this.name = name
      this.symbol = symbol
      this.quantity = quantity
      this.agreement = agreement
      this.image = image
    }

    sellTo(purchaser,transferQuantity,purchaserImage) {
      if (transferQuantity > this.quantity) {
        new Error(`Transfer Quantity is too large`)
      }
      this.quantity -= transferQuantity
      return new CorporateToken(purchaser,this.name, this.symbol,transferQuantity,this.agreement,purchaserImage)
    }

    setName(name) {this.name = name}
    setSymbol(symbol) {this.symbol = symbol}
    setQuantity(quantity) {this.quantity = quantity}
    setAgreement(agreement) {this.agreement = agreement}
    setImage(image) {this.image = image}
  }