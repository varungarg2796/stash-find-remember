
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
    } else if (data.price > 1000000) {
      errors.price = "Price must be less than 1,000,000";
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
    } else if (price > 1000000) {
      errors.price = "Price must be less than 1,000,000";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
