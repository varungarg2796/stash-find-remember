
import { Item } from "@/types";

/**
 * Validates item form data
 * @param data The item data to validate
 * @returns Object containing validation result and any errors
 */
export const validateItemForm = (
  data: Partial<Item>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim() === "") {
    errors.name = "Item name is required";
  } else if (data.name.length > 100) {
    errors.name = "Item name must be 100 characters or less";
  }

  // Validate description (optional but with max length)
  if (data.description && data.description.length > 500) {
    errors.description = "Description must be 500 characters or less";
  }

  // Validate quantity
  if (data.quantity === undefined || data.quantity === null) {
    errors.quantity = "Quantity is required";
  } else if (data.quantity <= 0 || !Number.isInteger(data.quantity)) {
    errors.quantity = "Quantity must be a positive whole number";
  } else if (data.quantity > 9999) {
    errors.quantity = "Quantity must be 9999 or less";
  }

  // Validate price (if provided)
  if (data.price !== undefined && data.price !== null) {
    if (data.price < 0) {
      errors.price = "Price cannot be negative";
    } else if (data.price > 100000000) {
      errors.price = "Price must be less than 100,000,000";
    }
  }

  // Validate tags (at least one tag required)
  if (!data.tags || data.tags.length === 0) {
    errors.tags = "At least one tag is required";
  }
  
  // Either an image URL, icon type, or default image is required (handled in ItemForm)
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates bulk import row data
 * @param data The row data to validate
 * @returns Object containing validation result and any errors
 */
export const validateBulkImportRow = (
  data: { [key: string]: any }
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  // Validate quantity
  if (!data.quantity) {
    errors.quantity = "Quantity is required";
  } else {
    const qty = Number(data.quantity);
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      errors.quantity = "Quantity must be a positive whole number";
    }
  }

  // Validate tags
  if (!data.tags || data.tags.trim() === "") {
    errors.tags = "At least one tag is required";
  }
  
  // Validate price if provided
  if (data.price !== undefined && data.price !== null && data.price !== "") {
    const price = Number(data.price);
    if (isNaN(price)) {
      errors.price = "Price must be a number";
    } else if (price < 0) {
      errors.price = "Price cannot be negative";
    } else if (price > 100000000) {
      errors.price = "Price must be less than 100,000,000";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Add these new utility validation functions
/**
 * Validates item name
 * @param name The name to validate
 * @returns Object containing validation result and message
 */
export const validateItemName = (
  name: string
): { isValid: boolean; message: string } => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Name is required" };
  } else if (name.length > 100) {
    return { isValid: false, message: "Name must be 100 characters or less" };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates item quantity
 * @param quantity The quantity to validate
 * @returns Object containing validation result and message
 */
export const validateQuantity = (
  quantity: number
): { isValid: boolean; message: string } => {
  if (quantity === undefined || quantity === null) {
    return { isValid: false, message: "Quantity is required" };
  } else if (quantity <= 0 || !Number.isInteger(Number(quantity))) {
    return { isValid: false, message: "Quantity must be a positive whole number" };
  } else if (quantity > 9999) {
    return { isValid: false, message: "Quantity must be 9999 or less" };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates item price
 * @param price The price to validate
 * @returns Object containing validation result and message
 */
export const validatePrice = (
  price: number | undefined
): { isValid: boolean; message: string } => {
  if (price === undefined || price === null) {
    return { isValid: true, message: "" };
  }
  
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return { isValid: false, message: "Price must be a number" };
  } else if (numPrice < 0) {
    return { isValid: false, message: "Price cannot be negative" };
  } else if (numPrice > 100000000) {
    return { isValid: false, message: "Price must be less than 100,000,000" };
  }
  return { isValid: true, message: "" };
};
