"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/use-profile"
import { useFeedback } from "@/hooks/use-feedback"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { profileData, saveProfileData } = useProfile()
  const { showFeedback } = useFeedback()
  const [formData, setFormData] = useState({ ...profileData })

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profileData })
    }
  }, [isOpen, profileData])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    saveProfileData(formData)
    showFeedback("Profile settings saved successfully.", "success")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Website Profile & Settings</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4">
          These details are saved separately and persist when the workflow is reset. They can be used in prompts via
          placeholders like <code className="bg-muted px-1 py-0.5 rounded text-xs">[our domain]</code>.
        </p>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="profileLogoUrl">Website Logo URL</Label>
            <Input
              id="profileLogoUrl"
              value={formData.logoUrl || ""}
              onChange={(e) => handleInputChange("logoUrl", e.target.value)}
              placeholder="e.g., https://your-blog.com/logo.png"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL for your website logo to display it in the sidebar.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileOurDomain">Your Website Domain</Label>
            <Input
              id="profileOurDomain"
              value={formData.ourDomain || ""}
              onChange={(e) => handleInputChange("ourDomain", e.target.value)}
              placeholder="e.g., your-blog.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileGeneralCompetitors">General Competitors (Main Rivals)</Label>
            <Textarea
              id="profileGeneralCompetitors"
              value={formData.generalCompetitors || ""}
              onChange={(e) => handleInputChange("generalCompetitors", e.target.value)}
              placeholder="e.g., competitor1.com, competitor2.net (one per line or comma-separated)"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Used for general competitive context in prompts. Step 1 is for specific article competitors.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileBrandVoice">Brand Voice / Tone Guidelines</Label>
            <Textarea
              id="profileBrandVoice"
              value={formData.brandVoice || ""}
              onChange={(e) => handleInputChange("brandVoice", e.target.value)}
              placeholder="Describe your desired writing style (e.g., professional, conversational, witty, authoritative, target audience)."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileSocialHandles">Social Media Handles/Links</Label>
            <Textarea
              id="profileSocialHandles"
              value={formData.socialHandles || ""}
              onChange={(e) => handleInputChange("socialHandles", e.target.value)}
              placeholder="e.g., Twitter: @handle, LinkedIn: /company/name (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileSitemapUrl">Sitemap URL</Label>
            <Input
              id="profileSitemapUrl"
              value={formData.sitemapUrl || ""}
              onChange={(e) => handleInputChange("sitemapUrl", e.target.value)}
              placeholder="e.g., https://your-blog.com/sitemap.xml"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileWpAdminUrl">WP-Admin URL (or CMS Login)</Label>
            <Input
              id="profileWpAdminUrl"
              value={formData.wpAdminUrl || ""}
              onChange={(e) => handleInputChange("wpAdminUrl", e.target.value)}
              placeholder="e.g., https://your-blog.com/wp-admin"
              type="url"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

