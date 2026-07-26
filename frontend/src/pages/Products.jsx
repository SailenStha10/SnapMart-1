import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiHeart,
  FiSearch,
  FiStar,
  FiTag,
  FiZap,
} from 'react-icons/fi'
import api from '../services/api'
import useCart from '../hooks/useCart'

const defaultProduct = {
  shop: 'SnapMart',
  rating: 0,
  reviews: 0,
  badge: '',
  brand: 'SnapMart',
  priceRange: '',
  inStorePickup: true,
  sameDayDelivery: true,
}

const mapProduct = (product) => ({
  ...defaultProduct,
  id: product.id,
  name: product.name,
  price: product.price,
  category: 'Uncategorized',
  image: product.images?.[0] || 'https://images.unsplash.com/photo-1567533804214-76ad02308147?auto=format&fit=crop&w=800&q=80',
  inStock: product.stock > 0,
  priceRange:
    product.price < 25
      ? 'Under $25'
      : product.price <= 50
        ? '$25-$50'
        : product.price <= 100
          ? '$50-$100'
          : '$100+',
  badge: product.stock === 0 ? 'Out of stock' : product.createdAt && Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 ? 'New arrival' : '',
  createdAt: product.createdAt,
})

export default function Products() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('Any')
  const [selectedPrice, setSelectedPrice] = useState('Any')
  const [selectedSort, setSelectedSort] = useState('Best rating')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [inStock, setInStock] = useState(false)
  const [inStorePickup, setInStorePickup] = useState(false)
  const [sameDayDelivery, setSameDayDelivery] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 2
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get('/products')
        const fetched = (data.products || []).map(mapProduct)
        setProducts(fetched)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const quickCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean))
    return ['All', ...cats]
  }, [products])

  const brands = useMemo(() => {
    const brs = new Set(products.map((p) => p.brand).filter(Boolean))
    return ['Any', ...brs]
  }, [products])

  const priceRanges = useMemo(() => {
    const ranges = new Set(products.map((p) => p.priceRange).filter(Boolean))
    return ['Any', ...ranges]
  }, [products])

  const sortOptions = ['Best rating', 'Lowest price', 'Newest', 'Most popular']

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory)
    }

    if (selectedBrand !== 'Any') {
      result = result.filter((product) => product.brand === selectedBrand)
    }

    if (selectedPrice !== 'Any') {
      result = result.filter((product) => product.priceRange === selectedPrice)
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.shop.toLowerCase().includes(query),
      )
    }

    if (inStock) {
      result = result.filter((product) => product.inStock)
    }

    if (inStorePickup) {
      result = result.filter((product) => product.inStorePickup)
    }

    if (sameDayDelivery) {
      result = result.filter((product) => product.sameDayDelivery)
    }

    switch (selectedSort) {
      case 'Lowest price':
        result.sort((a, b) => a.price - b.price)
        break
      case 'Newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'Most popular':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedPrice,
    selectedSort,
    inStock,
    inStorePickup,
    sameDayDelivery,
  ])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage))

  const pagedProducts = useMemo(() => {
    const validPage = Math.min(Math.max(currentPage, 1), pageCount)
    const start = (validPage - 1) * productsPerPage
    return filteredProducts.slice(start, start + productsPerPage)
  }, [filteredProducts, currentPage, pageCount])

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedBrand('Any')
    setSelectedPrice('Any')
    setSelectedSort('Best rating')
    setSearchTerm('')
    setSearchParams({})
    setInStock(false)
    setInStorePickup(false)
    setSameDayDelivery(false)
  }

  useEffect(() => {
    const query = searchParams.get('search') || ''
    setSearchTerm(query)
  }, [searchParams])

  const handleSearchChange = (event) => {
    const nextValue = event.target.value
    setSearchTerm(nextValue)

    if (nextValue.trim()) {
      setSearchParams({ search: nextValue })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">Category</option>
            {quickCategories
              .filter((option) => option !== 'All')
              .map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>

          <select
            value={selectedSort}
            onChange={(event) => setSelectedSort(event.target.value)}
            className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Best rating">Best rating</option>
            <option value="Lowest price">Lowest price</option>
            <option value="Newest">Newest</option>
            <option value="Most popular">Most popular</option>
          </select>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products"
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary md:w-64"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="sticky top-4 h-fit w-80 flex-shrink-0 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowFilters(false)}>
                  <FiArrowLeft className="cursor-pointer" />
                </button>
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3 rounded p-2 hover:bg-gray-50">
                <FiFilter />
                <span>Products</span>
              </div>
              <div className="flex items-center gap-3 rounded p-2 hover:bg-gray-50">
                <FiTag />
                <span>Price & Deals</span>
              </div>
              <div className="flex items-center gap-3 rounded p-2 hover:bg-gray-50">
                <FiZap />
                <span>Availability</span>
              </div>
              <div className="flex items-center gap-3 rounded p-2 hover:bg-gray-50">
                <FiStar />
                <span>Rating</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Try: 'toothpaste', 'lamp'"
                  className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-medium">Quick Category</h3>
              <div className="flex flex-wrap gap-2">
                {quickCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-medium">Brand</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('Any')}
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedBrand === 'Any' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Any brand
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setSelectedBrand(brand)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedBrand === brand ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPrice('Any')}
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedPrice === 'Any' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Any
                </button>
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedPrice(range)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedPrice === range ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-medium">Sort by</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedSort(option)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      selectedSort === option ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-medium">Availability</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(event) => setInStock(event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">In stock</span>
                  </div>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">Available</span>
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStorePickup}
                      onChange={(event) => setInStorePickup(event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">In-store pickup</span>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">Pickup</span>
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sameDayDelivery}
                      onChange={(event) => setSameDayDelivery(event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Same-day delivery</span>
                  </div>
                  <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-800">Today</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <button type="button" onClick={clearFilters} className="w-full rounded-lg border py-2 hover:bg-gray-50">
                Clear all
              </button>
              <button type="button" className="w-full rounded-lg border py-2 hover:bg-gray-50">
                Save filter
              </button>
              <button type="button" className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90">
                Show {filteredProducts.length} results
              </button>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Results</h1>
            <p className="text-sm text-gray-600">Powered for your preferences</p>
          </div>

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No products match the current filters.</p>
            </div>
          ) : (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pagedProducts.map((product) => (
                <div key={product.id} className="rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg">
                  {product.badge && (
                    <span className="mb-2 inline-block rounded-full bg-primary px-2 py-1 text-xs text-white">
                      {product.badge}
                    </span>
                  )}
                  <div className="relative mb-3">
                    <img src={product.image} alt={product.name} className="h-40 w-full rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <FiHeart className={isInWishlist(product.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <h3 className="mb-1 font-medium">{product.name}</h3>
                  <p className="mb-2 text-sm text-gray-600">{product.shop}</p>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center">
                      <FiStar className="fill-current text-yellow-500" />
                      <span className="ml-1 text-sm">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Rs: {product.price}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pageCount}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-lg ${currentPage === page ? 'bg-primary text-white' : 'border hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                className="rounded-lg border p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiChevronRight />
              </button>

              <select
                value={currentPage}
                onChange={(event) => setCurrentPage(Number(event.target.value))}
                className="ml-4 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: pageCount }, (_, index) => (
                  <option key={index} value={index + 1}>
                    Page {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
