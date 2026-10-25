import { z } from "zod";

// থিম ইনপুটের জন্য সুরক্ষিত স্কিমা
export const themeSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .regex(/^[a-zA-Z0-9\s\-:&.,()]+$/, "Title contains invalid characters"),
  
  slug: z.string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase, numbers and hyphens"),
  
  category_id: z.string().uuid("Invalid category ID").nullable().optional(),
  
  price: z.number()
    .positive("Price must be positive")
    .max(999999, "Price is too high"),
  
  old_price: z.number().positive().nullable().optional(),
  
  description: z.string()
    .min(10, "Description too short")
    .max(2000, "Description too long"),
  
  image_url: z.string().url("Invalid image URL"),
  demo_url: z.string().url("Invalid demo URL").or(z.literal("#")),
  file_path: z.string().min(1, "Download file is required"),
  
  features: z.array(z.string().max(100)).max(50),
  technologies: z.array(z.string().max(50)).max(20),
  gallery_images: z.array(z.string().url()).max(10),
  
  file_included: z.string().max(200).optional(),
  browser_support: z.string().max(100).optional(),
  responsive: z.string().max(100).optional(),
  updates: z.string().max(100).optional(),
  
  is_premium: z.boolean(),
});

// অর্ডার ভ্যালিডেশন স্কিমা
export const orderSchema = z.object({
  themeSlug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

// রিভিউ ভ্যালিডেশন স্কিমা (XSS প্রতিরোধে)
export const reviewSchema = z.object({
  themeId: z.string().uuid(),
  name: z.string().min(2).max(50).regex(/^[a-zA-Z\s]+$/),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500),
});

// HTML sanitization ফাংশন (XSS প্রতিরোধে)
export function sanitizeHtml(str) {
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}