export type SubmenuItem = {
  name: string;
  href: string;
  slug?: string;
};

export type DropdownItem = {
  name: string;
  href: string;
  slug?: string;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
};

export type MenuItem = {
  name: string;
  href: string;
  hasDropdown?: boolean;
  highlight?: boolean;
  dropdownItems?: DropdownItem[];
};

export const popularSearches = [
  "New Arrivals",
  "Men's Shirts",
  "Women's Dresses",
  "Gym Wear",
  "Designer Bags",
  "Sneakers",
];

export const menuItems: MenuItem[] = [
  {
    name: "NEW ARRIVALS",
    href: "/new-arrivals",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Men",
        href: "/new-arrivals/men",
        hasSubmenu: true,
        submenuItems: [
          { name: "Shirts", href: "/new-arrivals/men/shirts" },
          { name: "Pants", href: "/new-arrivals/men/pants" },
          { name: "Shoes", href: "/new-arrivals/men/shoes" },
          { name: "Accessories", href: "/new-arrivals/men/accessories" },
        ],
      },
      {
        name: "Women",
        href: "/new-arrivals/women",
        hasSubmenu: true,
        submenuItems: [
          { name: "Dresses", href: "/new-arrivals/women/dresses" },
          { name: "Tops", href: "/new-arrivals/women/tops" },
          { name: "Shoes", href: "/new-arrivals/women/shoes" },
          { name: "Bags", href: "/new-arrivals/women/bags" },
        ],
      },
      { name: "Gym Wears", href: "/new-arrivals/gym-wears" },
      { name: "Accessories", href: "/new-arrivals/accessories" },
    ],
  },
  {
    name: "MEN",
    href: "/men",
    hasDropdown: true,
    dropdownItems: [
      { name: "Pants", href: "/men/pants" },
      { name: "Bags", href: "/men/bags" },
      { name: "Shirt", href: "/men/shirt" },
      { name: "Cap", href: "/men/cap" },
      { name: "Belt", href: "/men/belt" },
      { name: "Shoes", href: "/men/shoes" },
      { name: "Slippers", href: "/men/slippers" },
      { name: "Shorts", href: "/men/shorts" },
      { name: "Men Sets", href: "/men/sets" },
      { name: "Jacket", href: "/men/jacket" },
    ],
  },
  {
    name: "WOMEN",
    href: "/women",
    hasDropdown: true,
    dropdownItems: [
      { name: "Jackets", href: "/women/jackets" },
      { name: "Shirts", href: "/women/shirts" },
      { name: "Bags", href: "/women/bags" },
      { name: "Slippers", href: "/women/slippers" },
      { name: "Shoes", href: "/women/shoes" },
      { name: "Handbags", href: "/women/handbags" },
      { name: "Purses", href: "/women/purses" },
      { name: "Sets", href: "/women/sets" },
      { name: "Gowns", href: "/women/gowns" },
    ],
  },
  {
    name: "GYM WEARS",
    href: "/gym-wears",
    highlight: true,
  },
  {
    name: "BAGS",
    href: "/bags",
  },
  {
    name: "ACCESSORIES",
    href: "/accessories",
    highlight: true,
  },
];
