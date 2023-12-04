export interface SalesDetails {
  product: Product
  buyer: Buyer
  date: string
  payment: Payment
}

export interface Product {
  id: number
  name: string
  slug: string
  brand: string
  category: string
  price: number
  image: string
  hasFreeShipping: boolean
  rating: number
  description: string
}

export interface Buyer {
  name: string
  avatar: string | null
}

export interface Payment {
  total: number
  receivedPaymentStatus: string
  paidAmount: number
  status: string
}

export interface Data {
  responsiveId: string
  id: number
  avatar: string
  fullName: string
  post: string
  email: string
  city: string
  startDate: string
  salary: number
  age: string | number
  experience: string
  status: number
}
