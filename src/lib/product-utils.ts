import { Product, ProductDetail, Size, Color } from "@/types";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:8000/storage';

export const getImageUrl = (path: any) => {
  if (!path || typeof path !== 'string' || path === 'null') return "/images/placeholder.jpg";
  
  // Replace backslashes with forward slashes
  let cleanPath = path.replace(/\\/g, '/');
  
  // If it's already a full URL or data URI, return as is
  if (cleanPath.startsWith('http') || cleanPath.startsWith('data:')) {
    return cleanPath;
  }

  // Clean up the path: remove leading slashes and collapse multiple slashes
  cleanPath = cleanPath.replace(/^\/+/, '').replace(/\/+/g, '/');
  
  return `${STORAGE_URL}/${cleanPath}`;
};

export const mapApiProductToFrontend = (apiProduct: any): Product => {
  const parseImages = (imgData: any) => {
    if (!imgData) return [];
    if (typeof imgData === 'string') {
      try {
        const parsed = JSON.parse(imgData);
        return Array.isArray(parsed) ? parsed.map(getImageUrl) : [getImageUrl(imgData)];
      } catch (e) {
        return [getImageUrl(imgData)];
      }
    }
    if (Array.isArray(imgData)) return imgData.map(getImageUrl);
    return [];
  };

  const mainImage = parseImages(apiProduct.main_image);
  const images = parseImages(apiProduct.images);

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    price: Number(apiProduct.price),
    discount: apiProduct.discount ? Number(apiProduct.discount) : undefined,
    images: images,
    mainImage: mainImage,
    categoryId: apiProduct.category_id,
    subcategoryId: apiProduct.subcategory_id,
    description: apiProduct.description,
    qty: Number(apiProduct.qty) || 0,
    isActive: Boolean(apiProduct.is_active),
    newArrival: Boolean(apiProduct.new_arrival),
    bestSeller: Boolean(apiProduct.best_seller),
    unisex: Boolean(apiProduct.unisex),
    recommended: Boolean(apiProduct.recommended),
    color: apiProduct.color ? {
      id: apiProduct.color.id,
      name: apiProduct.color.name,
      code: apiProduct.color.code
    } : undefined,
    category: apiProduct.category ? {
      id: apiProduct.category.id,
      name: apiProduct.category.name,
      slug: apiProduct.category.slug,
      status: Boolean(apiProduct.category.status)
    } : undefined,
    subcategory: apiProduct.subcategory ? {
      id: apiProduct.subcategory.id,
      name: apiProduct.subcategory.name,
      slug: apiProduct.subcategory.slug,
      status: Boolean(apiProduct.subcategory.status),
      categoryId: apiProduct.subcategory.category_id
    } : undefined,
    shippingDetail: apiProduct.shipping_detail,
    variationGroupId: apiProduct.variation_group_id,
    completeGroupId: apiProduct.complete_group_id,
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
  };
};

export const mapApiProductDetailToFrontend = (apiData: any): ProductDetail => {
  const product = mapApiProductToFrontend(apiData);
  
  return {
    ...product,
    sizeDetails: (apiData.size_details || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      sizeCode: s.size_code
    })),
    completeDetails: (apiData.complete_details || []).map(mapApiProductToFrontend),
    variations: (apiData.variations || []).map(mapApiProductToFrontend),
  };
};
