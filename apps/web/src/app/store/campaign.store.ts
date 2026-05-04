import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CampaignState {
  message: string;
  imageUrl: string | null;
  setMessage: (message: string) => void;
  setImageUrl: (url: string | null) => void;
  reset: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      message: "",
      imageUrl: null,
      setMessage: (message) => set({ message }),
      setImageUrl: (imageUrl) => set({ imageUrl }),
      reset: () => set({ message: "", imageUrl: null }),
    }),
    {
      name: "campaign-storage", // nombre de la llave en localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
