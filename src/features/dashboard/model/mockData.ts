export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  type: 'stock' | 'contract'
  volume?: string
  marketCap?: string
  high24h?: number
  low24h?: number
}

export interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  category: string
}

export interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  type: 'stock' | 'contract'
}

export const mockStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 182.45, change: 2.35, changePercent: 1.31, type: 'stock', volume: '52.4M', marketCap: '2.87T', high24h: 183.2, low24h: 180.1 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.23, change: -0.85, changePercent: -0.6, type: 'stock', volume: '28.1M', marketCap: '1.76T', high24h: 142.5, low24h: 140.8 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.92, change: 4.21, changePercent: 1.12, type: 'stock', volume: '31.2M', marketCap: '2.82T', high24h: 380.0, low24h: 375.5 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.67, change: -3.45, changePercent: -1.37, type: 'stock', volume: '125.3M', marketCap: '789B', high24h: 252.3, low24h: 246.9 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.34, change: 1.89, changePercent: 1.07, type: 'stock', volume: '45.8M', marketCap: '1.84T', high24h: 179.2, low24h: 176.5 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.32, change: 12.45, changePercent: 1.44, type: 'stock', volume: '68.9M', marketCap: '2.16T', high24h: 878.5, low24h: 865.2 },
  { symbol: 'META', name: 'Meta Platforms', price: 492.18, change: -2.34, changePercent: -0.47, type: 'stock', volume: '18.7M', marketCap: '1.25T', high24h: 495.8, low24h: 490.5 },
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 512.89, change: 3.21, changePercent: 0.63, type: 'contract', volume: '89.2M', marketCap: '472B', high24h: 514.2, low24h: 510.3 },
  { symbol: 'QQQ', name: 'Nasdaq-100 ETF', price: 445.67, change: 2.78, changePercent: 0.63, type: 'contract', volume: '52.1M', marketCap: '218B', high24h: 447.1, low24h: 443.2 },
  { symbol: 'GLD', name: 'Gold ETF', price: 189.23, change: -0.45, changePercent: -0.24, type: 'contract', volume: '8.3M', marketCap: '68B', high24h: 190.1, low24h: 188.9 },
]

export const mockNews: NewsItem[] = [
  { id: '1', title: 'Fed Signals Potential Rate Cut in Coming Months', source: 'Financial Times', time: '2 hours ago', category: 'Markets' },
  { id: '2', title: 'Tech Stocks Rally on Strong Earnings Reports', source: 'Bloomberg', time: '4 hours ago', category: 'Technology' },
  { id: '3', title: 'Oil Prices Surge Amid Middle East Tensions', source: 'Reuters', time: '5 hours ago', category: 'Commodities' },
  { id: '4', title: 'Apple Announces New AI Features for iPhone', source: 'CNBC', time: '6 hours ago', category: 'Technology' },
  { id: '5', title: 'European Markets Close Higher on Economic Data', source: 'Wall Street Journal', time: '7 hours ago', category: 'Markets' },
  { id: '6', title: 'Tesla Recalls 2M Vehicles Over Safety Concerns', source: 'Bloomberg', time: '8 hours ago', category: 'Automotive' },
  { id: '7', title: 'Bitcoin Breaks $70,000 Milestone', source: 'CoinDesk', time: '10 hours ago', category: 'Crypto' },
  { id: '8', title: 'Amazon Reports Record Prime Day Sales', source: 'CNBC', time: '12 hours ago', category: 'E-commerce' },
]

export const mockPortfolio: PortfolioHolding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgPrice: 175.2, currentPrice: 182.45, type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgPrice: 365.5, currentPrice: 378.92, type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 15, avgPrice: 820.0, currentPrice: 875.32, type: 'stock' },
  { symbol: 'SPY', name: 'S&P 500 ETF', shares: 100, avgPrice: 495.3, currentPrice: 512.89, type: 'contract' },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 25, avgPrice: 255.8, currentPrice: 248.67, type: 'stock' },
]
