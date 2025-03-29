"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, ExternalLink } from "lucide-react"
import { useFeedback } from "@/hooks/use-feedback"

// Stock image sites list
const stockSitesList = [
  { name: "Unsplash", url: "https://unsplash.com/s/photos/" },
  { name: "Pexels", url: "https://www.pexels.com/search/" },
  { name: "Pixabay", url: "https://pixabay.com/images/search/" },
  { name: "Shutterstock", url: "https://www.shutterstock.com/search?searchterm=" },
  { name: "Adobe Stock", url: "https://stock.adobe.com/search?k=" },
  { name: "Freepik", url: "https://www.freepik.com/search?query=" },
  { name: "Burst by Shopify", url: "https://burst.shopify.com/search?q=" },
  { name: "Gratisography", url: "https://gratisography.com/?s=" },
  { name: "Kaboompics", url: "https://kaboompics.com/search/" },
  { name: "Picjumbo", url: "https://picjumbo.com/?s=" },
  { name: "Pikwizard", url: "https://pikwizard.com/?s=" },
  { name: "ISO Republic", url: "https://isorepublic.com/?s=" },
  { name: "Stockvault", url: "https://www.stockvault.net/search?q=" },
  { name: "Stocksnap", url: "https://stocksnap.io/search/" },
  { name: "Morguefile", url: "https://morguefile.com/?s=" },
  { name: "Reshot", url: "https://www.reshot.com/search/" },
  { name: "Stokpic", url: "https://stokpic.com/?s=" },
  { name: "FreeImages", url: "https://www.freeimages.com/search/" },
  { name: "Foodiesfeed", url: "https://www.foodiesfeed.com/?s=" },
  { name: "Nappy", url: "https://nappy.co/search/" },
]

export default function StockImageSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSites, setSelectedSites] = useState<number[]>([])
  const { showFeedback } = useFeedback()

  const toggleSite = (siteIndex: number) => {
    setSelectedSites((prev) => (prev.includes(siteIndex) ? prev.filter((i) => i !== siteIndex) : [...prev, siteIndex]))
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSites(stockSitesList.map((_, index) => index))
    } else {
      setSelectedSites([])
    }
  }

  const searchStockImages = () => {
    if (!searchQuery.trim()) {
      showFeedback("Please enter a keyword for image search.", "warning")
      return
    }

    if (selectedSites.length === 0) {
      showFeedback("Please select at least one image site.", "warning")
      return
    }

    selectedSites.forEach((siteIndex) => {
      const site = stockSitesList[siteIndex]
      if (site) {
        window.open(site.url + encodeURIComponent(searchQuery), "_blank")
      }
    })

    showFeedback(`Opened ${selectedSites.length} search tabs.`, "info")
  }

  return (
    <div className="mt-6 border-t border-border pt-6">
      <h3 className="text-xl font-semibold flex items-center mb-2">
        <Search className="w-5 h-5 mr-2 text-primary" /> Stock Image Search
      </h3>

      <p className="text-muted-foreground mb-4 text-sm">
        Select sites and enter a keyword to open searches in new tabs.
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="stockSearchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter image keyword (e.g., 'business meeting')"
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <Label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox
            checked={selectedSites.length === stockSitesList.length}
            onCheckedChange={(checked) => toggleSelectAll(checked === true)}
          />
          <span>Select All Sites</span>
        </Label>

        <Button onClick={searchStockImages}>
          <ExternalLink className="mr-2 h-4 w-4" /> Search Selected Sites
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-muted rounded-lg border">
        {stockSitesList.map((site, index) => (
          <Label
            key={index}
            className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
          >
            <Checkbox
              checked={selectedSites.includes(index)}
              onCheckedChange={() => toggleSite(index)}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <span>{site.name}</span>
          </Label>
        ))}
      </div>
    </div>
  )
}

