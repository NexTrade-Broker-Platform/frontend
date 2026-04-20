import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowDownRight, ArrowUpRight, Filter, Search } from 'lucide-react'
import { mockStocks } from '../model/mockData'

export function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'contract'>('all')

  const filteredStocks = mockStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || stock.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Markets</h1>
        <p className="text-muted-foreground">Browse and trade available instruments</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stocks or contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-input bg-input-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-5 text-muted-foreground" />
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setFilterType('all')}
              className={`rounded-md px-4 py-2 text-sm transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('stock')}
              className={`rounded-md px-4 py-2 text-sm transition-colors ${
                filterType === 'stock'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Stocks
            </button>
            <button
              onClick={() => setFilterType('contract')}
              className={`rounded-md px-4 py-2 text-sm transition-colors ${
                filterType === 'contract'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Contracts
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">Symbol</th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Change</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Volume</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="border-b border-border transition-colors last:border-0 hover:bg-accent"
                >
                  <td className="px-6 py-4">
                    <Link to={`/stock/${stock.symbol}`} className="text-primary hover:underline">
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-foreground">{stock.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs ${
                        stock.type === 'stock'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-chart-2/10 text-chart-2'
                      }`}
                    >
                      {stock.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-foreground">${stock.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className={`flex items-center justify-end gap-1 ${
                        stock.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownRight className="size-4" />
                      )}
                      <span>
                        {stock.change >= 0 ? '+' : ''}
                        {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{stock.volume}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{stock.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStocks.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          No instruments found matching your criteria
        </div>
      )}
    </div>
  )
}
