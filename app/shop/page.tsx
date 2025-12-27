"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/shared/header";
import { SHOP_PRODUCTS, CATEGORIES, type Product } from "@/lib/data/shop-products";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { ExternalLink, ShoppingBag, Sparkles } from "lucide-react";

/**
 * Shop page with curated plant care products.
 * Beautiful gallery layout with category filtering and delightful animations.
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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <FadeInUp>
          <section className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-100 text-sage-600 rounded-full text-sm font-medium mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <ShoppingBag className="w-4 h-4" />
              Curated Collection
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Plant Care Essentials
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Thoughtfully selected tools and supplies to help your plants thrive.
              Quality items we personally recommend.
            </motion.p>
          </section>
        </FadeInUp>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-terracotta-400" />
              <h2 className="text-lg font-medium text-foreground">
                Editor&apos;s Picks
              </h2>
            </div>
            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              delay={0.08}
            >
              {featuredProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <FeaturedProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.section>
        )}

        {/* Category Filter */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "min-h-[44px]", // Mobile touch target
                  selectedCategory === category.id
                    ? "bg-sage-500 text-white"
                    : "bg-cream-100 text-muted-foreground hover:bg-cream-200"
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Product Grid */}
        <section>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </motion.div>
          )}
        </section>

        {/* Affiliate Disclosure */}
        <motion.section
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto">
            Some links on this page are affiliate links. We may earn a small
            commission if you make a purchase, at no extra cost to you. This
            helps support Grove&apos;s development.
          </p>
        </motion.section>
      </main>
    </div>
  );
}

/**
 * Featured product card with larger image, highlight styling, and hover effects.
 */
function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <motion.a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border border-cream-200 overflow-hidden"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-cream-100">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="absolute top-3 left-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="px-2 py-1 bg-terracotta-400 text-white text-xs font-medium rounded-full shadow-md">
            Featured
          </span>
        </motion.div>
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
        <motion.p
          className="text-lg font-semibold text-sage-600 mt-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {product.price}
        </motion.p>
      </div>
    </motion.a>
  );
}

/**
 * Standard product card with subtle hover animations.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <motion.a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl border border-cream-200 overflow-hidden"
      whileHover={{ y: -2, boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden bg-cream-100">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
        {/* Subtle shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground text-sm sm:text-base group-hover:text-sage-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-sm sm:text-base font-semibold text-sage-600 whitespace-nowrap">
            {product.price}
          </span>
        </div>
        <p className="text-sm sm:text-xs text-muted-foreground mt-1.5 line-clamp-2">
          {product.description}
        </p>
      </div>
    </motion.a>
  );
}
