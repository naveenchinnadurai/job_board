import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function shorten(text: string, wordLimit: number = 20): string {
  const words = text.split(/\s+/); 
  if (words.length <= wordLimit) {
    return text; 
  }
  return words.slice(0, wordLimit).join(" ") + "...";
}