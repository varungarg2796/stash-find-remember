
import React, { createContext, useContext, useState } from "react";
import { Collection, CollectionItem, ShareSettings } from "@/types";
import { toast } from "sonner";

type CollectionsContextType = {
  collections: Collection[];
  addCollection: (collection: Omit<Collection, "id" | "createdAt" | "updatedAt" | "shareSettings">) => void;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
  getCollection: (id: string) => Collection | undefined;
  addItemToCollection: (collectionId: string, itemId: string, note?: string) => void;
  removeItemFromCollection: (collectionId: string, itemId: string) => void;
  updateShareSettings: (collectionId: string, settings: ShareSettings) => void;
  getSharedCollection: (shareId: string) => Collection | undefined;
  reorderCollectionItems: (collectionId: string, items: CollectionItem[]) => void;
};

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const generateShareId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const addCollection = (newCollection: Omit<Collection, "id" | "createdAt" | "updatedAt" | "shareSettings">) => {
    const now = new Date();
    const collection: Collection = {
      ...newCollection,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      shareSettings: {
        isEnabled: false,
        shareId: generateShareId(),
        visibilityLevel: 'public',
        displaySettings: {
          showDescription: true,
          showQuantity: false,
          showLocation: false,
          showTags: true,
          showPrice: false,
          showAcquisitionDate: false,
        },
        allowComments: false,
        allowContact: false,
      }
    };
    
    setCollections((prev) => [...prev, collection]);
    toast.success("Collection created successfully");
  };

  const updateCollection = (updatedCollection: Collection) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === updatedCollection.id
          ? { ...updatedCollection, updatedAt: new Date() }
          : collection
      )
    );
    toast.success("Collection updated successfully");
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id));
    toast.success("Collection deleted successfully");
  };

  const getCollection = (id: string) => {
    return collections.find((collection) => collection.id === id);
  };

  const addItemToCollection = (collectionId: string, itemId: string, note?: string) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId) {
          const existingItem = collection.items.find(item => item.itemId === itemId);
          if (existingItem) {
            toast.error("Item already in collection");
            return collection;
          }
          
          const newItem: CollectionItem = {
            itemId,
            collectionNote: note,
            order: collection.items.length
          };
          
          return {
            ...collection,
            items: [...collection.items, newItem],
            updatedAt: new Date()
          };
        }
        return collection;
      })
    );
    toast.success("Item added to collection");
  };

  const removeItemFromCollection = (collectionId: string, itemId: string) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            items: collection.items.filter(item => item.itemId !== itemId),
            updatedAt: new Date()
          };
        }
        return collection;
      })
    );
    toast.success("Item removed from collection");
  };

  const reorderCollectionItems = (collectionId: string, items: CollectionItem[]) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            items: items.map((item, index) => ({ ...item, order: index })),
            updatedAt: new Date()
          };
        }
        return collection;
      })
    );
  };

  const updateShareSettings = (collectionId: string, settings: ShareSettings) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            shareSettings: settings,
            updatedAt: new Date()
          };
        }
        return collection;
      })
    );
    toast.success("Share settings updated");
  };

  const getSharedCollection = (shareId: string) => {
    return collections.find((collection) => 
      collection.shareSettings.shareId === shareId && collection.shareSettings.isEnabled
    );
  };

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        getCollection,
        addItemToCollection,
        removeItemFromCollection,
        updateShareSettings,
        getSharedCollection,
        reorderCollectionItems
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};
