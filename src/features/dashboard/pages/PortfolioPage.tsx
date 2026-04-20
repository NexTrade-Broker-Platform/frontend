import { Link } from 'react-router'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { mockPortfolio } from '../model/mockData'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']

export function PortfolioPage() {
  const totalValue = mockPortfolio.reduce(
    (sum, holding) => sum + holding.shares * holding.currentPrice,
    0,
  )
  const totalCost = mockPortfolio.reduce(
    (sum, holding) => sum + holding.shares * holding.avgPrice,
    0,
  )
  const totalGain = totalValue - totalCost
  const totalGainPercent = (totalGain / totalCost) * 100

  const pieData = mockPortfolio.map((holding) => ({
    name: holding.symbol,
    value: holding.shares * holding.currentPrice,
  }))

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Portfolio</h1>
        <p className="text-muted-foreground">Track your holdings and performance</p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Total Value</div>
          <div className="mb-2">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center text-sm ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
            {totalGain >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
            <span>
              {totalGainPercent >= 0 ? '+' : ''}
              {totalGainPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Total Gain/Loss</div>
          <div className="mb-2">
            ${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
            {totalGain >= 0 ? 'Profit' : 'Loss'}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Total Investment</div>
          <div className="mb-2">
            ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-muted-foreground">{mockPortfolio.length} positions</div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-6">Holdings</h3>
          <div className="space-y-4">
            {mockPortfolio.map((holding) => {
              const value = holding.shares * holding.currentPrice
              const cost = holding.shares * holding.avgPrice
              const gain = value - cost
              const gainPercent =
                ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
              const allocation = (value / totalValue) * 100

              return (
                <Link
                  key={holding.symbol}
                  to={`/stock/${holding.symbol}`}
                  className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent md:grid-cols-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-primary">{holding.symbol.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1">
                      <div>{holding.symbol}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end md:gap-8">
                    <div className="text-right">
                      <div>
                        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-sm ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {gain >= 0 ? '+' : ''}${Math.abs(gain).toFixed(2)} ({gainPercent >= 0 ? '+' : ''}
                        {gainPercent.toFixed(2)}%)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {allocation.toFixed(1)}% of portfolio
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6">Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="text-foreground">{((entry.value / totalValue) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
