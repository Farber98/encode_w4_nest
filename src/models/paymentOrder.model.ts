export class PaymentOrder {
    id: number
    secret: string
    value: number
    address: string

    constructor(id: number, secret: string, value: number) {
        this.id = id
        this.secret = secret
        this.value = value
    }
}

