import React, { useState, useEffect } from 'react';
import { StoreService } from './services/storeService';
import { MenuItem, Category, Review } from './types';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Customer Components
import { HeroSection } from './components/customer/HeroSection';
import { FeaturedSection } from './components/customer/FeaturedSection';
import { MenuBrowser } from './components/customer/MenuBrowser';
import { StorySection } from './components/customer/StorySection';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { FoodDetailModal } from './components/customer/FoodDetailModal';
import { ReviewModal } from './components/customer/ReviewModal';

export default function App() {
  // Navigation tab: 'home' | 'menu' | 'story' | 'reviews'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Live state from StoreService
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => StoreService.getMenuItems());
  const [categories, setCategories] = useState<Category[]>(() => StoreService.getCategories());
  const [reviews, setReviews] = useState<Review[]>(() => StoreService.getReviews());

  // Interactive modal states
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Synchronize state when switching views
  const refreshData = () => {
    setMenuItems(StoreService.getMenuItems());
    setCategories(StoreService.getCategories());
    setReviews(StoreService.getReviews());
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  // Scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Sticky Header with Navigation & Hotline */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreMenu={() => setActiveTab('menu')}
              featuredDishes={menuItems}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />
            <FeaturedSection
              dishes={menuItems}
              onSelectDish={(dish) => setSelectedDish(dish)}
              onViewAllMenu={() => setActiveTab('menu')}
            />
            <StorySection />
            <ReviewsSection
              reviews={reviews}
              onOpenReviewModal={() => setIsReviewModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'menu' && (
          <MenuBrowser
            categories={categories}
            menuItems={menuItems}
            onSelectDish={(dish) => setSelectedDish(dish)}
          />
        )}

        {activeTab === 'story' && <StorySection />}

        {activeTab === 'reviews' && (
          <ReviewsSection
            reviews={reviews}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        )}
      </main>

      {/* Footer with Hours, Location, and Contact */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenArchitectureModal={() => {}}
      />

      {/* Dish Information & Pricing Modal */}
      <FoodDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      {/* Guest Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => {
          setReviews(StoreService.getReviews());
          setIsReviewModalOpen(false);
        }}
      />
    </div>
  );
}
