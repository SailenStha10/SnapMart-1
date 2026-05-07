import { useState } from 'react'

export default function useCart(){
  const [items, setItems] = useState([])
  const add = (p)=> setItems(prev=>[...prev,p])
  const remove = (id)=> setItems(prev=>prev.filter(i=>i.id!==id))
  return { items, add, remove }
}
