
interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Validates item name
export const validateItemName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: "Item name is required" };
  }
  if (name.length > 50) {
    return { isValid: false, message: "Item name must be less than 50 characters" };
  }
  return { isValid: true };
};

// Validates description
export const validateDescription = (description: string): ValidationResult => {
  if (description && description.length > 500) {
    return { isValid: false, message: "Description must be less than 500 characters" };
  }
  return { isValid: true };
};

// Validates quantity
export const validateQuantity = (quantity: number): ValidationResult => {
  if (!quantity || quantity < 1) {
    return { isValid: false, message: "Quantity must be at least 1" };
  }
  if (quantity > 9999) {
    return { isValid: false, message: "Quantity cannot exceed 9999" };
  }
  return { isValid: true };
};

// Validates price
export const validatePrice = (price: number | undefined): ValidationResult => {
  if (price !== undefined) {
    if (price < 0) {
      return { isValid: false, message: "Price cannot be negative" };
    }
    if (price > 1000000) {
      return { isValid: false, message: "Price cannot exceed 1,000,000" };
    }
  }
  return { isValid: true };
};

// Validates tags
export const validateTags = (tags: string[]): ValidationResult => {
  if (tags.some(tag => tag.length > 30)) {
    return { isValid: false, message: "Each tag must be less than 30 characters" };
  }
  if (tags.length > 10) {
    return { isValid: false, message: "Maximum 10 tags allowed" };
  }
  return { isValid: true };
};

// Validates the entire form
export const validateItemForm = (data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateItemName(data.name);
  if (!nameValidation.isValid && nameValidation.message) {
    errors.name = nameValidation.message;
  }
  
  const descValidation = validateDescription(data.description);
  if (!descValidation.isValid && descValidation.message) {
    errors.description = descValidation.message;
  }
  
  const quantityValidation = validateQuantity(data.quantity);
  if (!quantityValidation.isValid && quantityValidation.message) {
    errors.quantity = quantityValidation.message;
  }
  
  const priceValidation = validatePrice(data.price);
  if (!priceValidation.isValid && priceValidation.message) {
    errors.price = priceValidation.message;
  }
  
  const tagsValidation = validateTags(data.tags);
  if (!tagsValidation.isValid && tagsValidation.message) {
    errors.tags = tagsValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
