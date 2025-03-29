"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface ProfileData { // Export the interface
  logoUrl: string
  ourDomain: string
  generalCompetitors: string
  brandVoice: string
  socialHandles: string
  sitemapUrl: string
  wpAdminUrl: string
}

type ProfileContextType = {
  profileData: ProfileData
  saveProfileData: (data: ProfileData) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const PROFILE_STORAGE_KEY = "aiBlogProfileData_v1.1"

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData>(getDefaultProfileData())

  // Load profile data on mount
  useEffect(() => {
    loadProfileData()
  }, [])

  // Load profile data from localStorage
  const loadProfileData = () => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (saved) {
      try {
        setProfileData(JSON.parse(saved))
        console.log("Loaded profile data from localStorage")
      } catch (e) {
        console.error("Error parsing profile data:", e)
        setProfileData(getDefaultProfileData()) // Reset if corrupt
      }
    } else {
      console.log("No saved profile data found, using defaults.")
    }
  }

  // Save profile data to localStorage
  const saveProfileData = (data: ProfileData) => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data))
      setProfileData(data)
      console.log("Profile data saved to localStorage")
    } catch (e) {
      console.error("Error saving profile data:", e)
    }
  }

  return <ProfileContext.Provider value={{ profileData, saveProfileData }}>{children}</ProfileContext.Provider>
}

// Default profile data
function getDefaultProfileData(): ProfileData {
  return {
    logoUrl: "",
    ourDomain: "",
    generalCompetitors: "",
    brandVoice: "",
    socialHandles: "",
    sitemapUrl: "",
    wpAdminUrl: "",
  }
}

// Hook to use the profile context
export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
