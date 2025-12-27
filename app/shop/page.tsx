"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/shared/header";
import { SHOP_PRODUCTS, CATEGORIES, type Product } from "@/lib/data/shop-products";
import { cn } from "@/lib/utils";
import { ExternalLink, ShoppingBag } from "lucide-react";

/**
 * Shop page with curated plant care products.
 * Beautiful gallery layout with category filtering.
 */
export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return SHOP_PRODUCTS;
    return SHOP_PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const featuredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((p) => p.featured);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showBack backHref="/" backLabel="Home" />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-100 text-sage-600 rounded-full text-sm font-medium mb-4">
            <ShoppingBag className="w-4 h-4" />
            Curated Collection
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plant Care Essentials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughtfully selected tools and supplies to help your plants thrive.
            Quality items we personally recommend.
          </p>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium text-foreground mb-6">
              Editor's Picks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === category.id
                    ? "bg-sage-500 text-white"
                    : "bg-cream-100 text-muted-foreground hover:bg-cream-200"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </section>

        {/* Affiliate Disclosure */}
        <section className="mt-16 text-center">
          <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto">
            Some links on this page are affiliate links. We may earn a small
            commission if you make a purchase, at no extra cost to you. This
            helps support Grove's development.
          </p>
        </section>
      </main>
    </div>
  );
}

/**
 * Featured product card with larger image and highlight styling.
 */
function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border border-cream-200 overflow-hidden transition-all hover:shadow-lifted hover:border-sage-200"
    >
      <div className="aspect-square relative overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-terracotta-400 text-white text-xs font-medium rounded-full">
            Featured
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-foreground group-hover:text-sage-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-lg font-semibold text-sage-600 mt-3">
          {product.price}
        </p>
      </div>
    </a>
  );
}

/**
 * Standard product card.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl border border-cream-200 overflow-hidden transition-all hover:shadow-soft hover:border-sage-200"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground text-sm group-hover:text-sage-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-sm font-semibold text-sage-600">
            {product.price}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
      </div>
    </a>
  );
}
