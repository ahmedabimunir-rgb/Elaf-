import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreService } from './services/storeService';
import { MenuItem, Category, Order, Review } from './types';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ArchitectureModal } from './components/common/ArchitectureModal';

// Customer Components
import { HeroSection } from './components/customer/HeroSection';
import { FeaturedSection } from './components/customer/FeaturedSection';
import { MenuBrowser } from './components/customer/MenuBrowser';
import { StorySection } from './components/customer/StorySection';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { FoodDetailModal } from './components/customer/FoodDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTracker } from './components/customer/OrderTracker';
import { ReviewModal } from './components/customer/ReviewModal';

// Admin Component
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainApp() {
  const { user } = useAuth();

  // Navigation tab: 'home' | 'menu' | 'story' | 'reviews' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Live state from StoreService
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => StoreService.getMenuItems());
  const [categories, setCategories] = useState<Category[]>(() => StoreService.getCategories());
  const [reviews, setReviews] = useState<Review[]>(() => StoreService.getReviews());

  // Interactive modal states
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [trackerOrder, setTrackerOrder] = useState<Order | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

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

  // Switch to admin view if user changed role to STAFF or ADMIN and clicks Admin
  if (activeTab === 'admin') {
    return (
      <AdminDashboard
        onBackToCustomerView={() => {
          refreshData();
          setActiveTab('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Primary Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onOpenOrderTracker={() => {
          setTrackerOrder(null);
          setIsTrackerOpen(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onOrderNow={() => setActiveTab('menu')}
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
              onOpenReviewModal={() => {
                setReviewOrder(null);
                setIsReviewModalOpen(true);
              }}
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
            onOpenReviewModal={() => {
              setReviewOrder(null);
              setIsReviewModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setIsCheckoutOpen(true);
        }}
      />

      {/* Dish Customization & Add-to-Cart Modal */}
      <FoodDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          setIsCheckoutOpen(false);
          setTrackerOrder(order);
          setIsTrackerOpen(true);
        }}
      />

      {/* Live Order Tracker Modal */}
      <OrderTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrder={trackerOrder}
        onOpenReviewModal={(order) => {
          setIsTrackerOpen(false);
          setReviewOrder(order);
          setIsReviewModalOpen(true);
        }}
      />

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={reviewOrder}
        onReviewSubmitted={() => {
          setReviews(StoreService.getReviews());
          setIsReviewModalOpen(false);
        }}
      />

      {/* Full-Stack Architecture Guide Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
