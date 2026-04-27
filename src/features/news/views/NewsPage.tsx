import { useState } from "react";
import { Newspaper, Search, TrendingUp } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
}

const newsItems: NewsItem[] = [
  { id: "1", title: "Fed Signals Potential Rate Cut in Coming Months", source: "Financial Times", time: "2 hours ago", category: "Markets" },
  { id: "2", title: "Tech Stocks Rally on Strong Earnings Reports", source: "Bloomberg", time: "4 hours ago", category: "Technology" },
  { id: "3", title: "Oil Prices Surge Amid Middle East Tensions", source: "Reuters", time: "5 hours ago", category: "Commodities" },
  { id: "4", title: "Apple Announces New AI Features for iPhone", source: "CNBC", time: "6 hours ago", category: "Technology" },
  { id: "5", title: "European Markets Close Higher on Economic Data", source: "Wall Street Journal", time: "7 hours ago", category: "Markets" },
  { id: "6", title: "Tesla Recalls 2M Vehicles Over Safety Concerns", source: "Bloomberg", time: "8 hours ago", category: "Automotive" },
  { id: "7", title: "Bitcoin Breaks $70,000 Milestone", source: "CoinDesk", time: "10 hours ago", category: "Crypto" },
  { id: "8", title: "Amazon Reports Record Prime Day Sales", source: "CNBC", time: "12 hours ago", category: "E-commerce" },
];

const categories = ["All", "Markets", "Technology", "Commodities", "Crypto", "E-commerce", "Automotive"];

export function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = newsItems.filter((news) => {
    const matchesCategory = selectedCategory === "All" || news.category === selectedCategory;
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Market News</h1>
        <p className="text-muted-foreground">Stay updated with the latest market developments</p>
      </div>

      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-input bg-input-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((news) => (
          <div
            key={news.id}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Newspaper className="size-6 text-primary" />
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                {news.category}
              </span>
            </div>
            <h3 className="mb-3 transition-colors group-hover:text-primary">{news.title}</h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4" />
                <span>{news.source}</span>
              </div>
              <span>{news.time}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          No news found matching your criteria
        </div>
      )}
    </div>
  );
}
