// apps/web/store/use-campaign-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CampaignState {
  message: string;
  imageUrl: string | null;
  imageName: string | null; // Guardamos también el nombre para la UI
  setMessage: (message: string) => void;
  setImageData: (url: string | null, name: string | null) => void;
  reset: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      message: "",
      imageUrl: null,
      imageName: null,
      setMessage: (message) => set({ message }),
      setImageData: (imageUrl, imageName) => set({ imageUrl, imageName }),
      reset: () => set({ message: "", imageUrl: null, imageName: null }),
    }),
    {
      name: "campaign-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
