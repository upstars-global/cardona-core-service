// Customer Types
export interface Customer {
  id: number
  customer: string
  customerId: number
  email: string
  country: string
  countryCode: string
  countryFlag?: string
  order: number
  totalSpent: number
  avatar: string
  status?: string
  contact?: string
}

export interface Referrals {
  id: number
  user: string
  email: string
  avatar: string
  referredId: number
  status: string
  value: string
  earning: string

}

export interface Review {
  id: number
  product: string
  companyName: string
  productImage: string
  reviewer: string
  email: string
  avatar: string
  date: string
  status: string
  review: number
  head: string
  para: string
}

export interface ECommerceProduct {
  id: number
  productName: string
  category: string
  stock: boolean
  sku: number
  price: string
  qty: number
  status: string
  image: string
  productBrand: string
}

export interface Order {
  id: number
  order: number
  customer: string
  email: string
  avatar: string
  payment: number
  status: string
  spent: number
  method: string
  date: string
  time: string
  methodNumber: number
}
