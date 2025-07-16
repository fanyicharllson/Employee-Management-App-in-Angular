import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validator to prevent pure numbers for usernames
export function notOnlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    // Check if the value consists only of numbers
    if (/^\d+$/.test(control.value)) {
      return { onlyNumbers: true };
    }
    
    return null; 
  };
}


// More permissive validator for company names
export function properCompanyNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    
    // Requires at least one letter, but allows numbers and other characters
    if (!/[a-zA-ZÀ-ÿ]/.test(control.value)) {
      return { invalidCompanyName: true };
    }
    
    return null;
  };
}