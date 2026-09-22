import React, { useState } from 'react';
import {
  X,
  Database,
  Server,
  Layers,
  Code2,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Cpu,
  TableProperties,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'schema' | 'api' | 'lifecycle'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  STAFF
  ADMIN
}

enum OrderType {
  DELIVERY
  PICKUP
  DINE_IN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  OUT_FOR_DELIVERY
  COMPLETED
  CANCELLED
}

enum PaymentMethod {
  CASH_ON_DELIVERY
  CARD_ON_DELIVERY
  TELEBIRR
  CHAPA
}

enum PaymentStatus {
  UNPAID
  PENDING
  PAID
  FAILED
  REFUNDED
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String?
  role      Role     @default(CUSTOMER)
  orders    Order[]
  reviews   Review[]
  createdAt DateTime @default(now())
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  menuItems   MenuItem[]
}

model MenuItem {
  id              String      @id @default(cuid())
  categoryId      String
  category        Category    @relation(fields: [categoryId], references: [id])
  name            String
  slug            String      @unique
  description     String
  price           Decimal     @db.Decimal(10, 2)
  imageUrl        String
  prepTimeMinutes Int         @default(20)
  isAvailable     Boolean     @default(true)
  isFeatured      Boolean     @default(false)
  isPopular       Boolean     @default(false)
  ingredients     String[]
  addons          Addon[]
  orderItems      OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model Addon {
  id          String   @id @default(cuid())
  menuItemId  String
  menuItem    MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  name        String
  price       Decimal  @db.Decimal(10, 2)
  isAvailable Boolean  @default(true)
}

model Order {
  id                  String        @id @default(cuid())
  orderNumber         String        @unique // e.g. ELAF-4829
  userId              String?
  user                User?         @relation(fields: [userId], references: [id])
  customerName        String
  customerPhone       String
  customerEmail       String?
  orderType           OrderType
  tableNumber         String?       // For QR dine-in
  deliveryAddress     String?
  deliveryNotes       String?
  specialInstructions String?
  items               OrderItem[]
  subtotal            Decimal       @db.Decimal(10, 2)
  deliveryFee         Decimal       @db.Decimal(10, 2) @default(0.00)
  discount            Decimal       @db.Decimal(10, 2) @default(0.00)
  total               Decimal       @db.Decimal(10, 2)
  couponCode          String?
  paymentMethod       PaymentMethod
  paymentStatus       PaymentStatus @default(PENDING)
  orderStatus         OrderStatus   @default(PENDING)
  internalNotes       String?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  name       String
  unitPrice  Decimal  @db.Decimal(10, 2)
  quantity   Int
  totalPrice Decimal  @db.Decimal(10, 2)
  addons     Json     // [{ name: String, price: Float }]
  notes      String?
}

model Coupon {
  id             String    @id @default(cuid())
  code           String    @unique
  description    String
  discountType   String    // 'PERCENTAGE' | 'FIXED'
  discountValue  Decimal   @db.Decimal(10, 2)
  minOrderAmount Decimal   @db.Decimal(10, 2) @default(0.00)
  usedCount      Int       @default(0)
  isActive       Boolean   @default(true)
  expiresAt      DateTime
}

model Review {
  id           String   @id @default(cuid())
  orderNumber  String
  customerName String
  rating       Int      // 1 to 5
  comment      String
  dishName     String?
  isPublished  Boolean  @default(true)
  createdAt    DateTime @default(now())
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-white text-lg">Elaf Full-Stack Architecture</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Engineering Spec
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                PostgreSQL Schema, Prisma ORM, REST API Contracts & Kitchen State Machine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 bg-zinc-900/40 border-b border-zinc-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'overview'
                ? 'bg-rose-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" /> System Blueprint
          </button>

          <button
            onClick={() => setActiveSection('schema')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'schema'
                ? 'bg-rose-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Database className="w-4 h-4" /> Prisma & PostgreSQL Schema
          </button>

          <button
            onClick={() => setActiveSection('api')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'api'
                ? 'bg-rose-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Server className="w-4 h-4" /> API Endpoints & Validation
          </button>

          <button
            onClick={() => setActiveSection('lifecycle')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'lifecycle'
                ? 'bg-rose-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Workflow className="w-4 h-4" /> Kitchen Order State Machine
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 text-sm">
          {/* Section 1: System Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h4 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Production-Ready Architecture Overview
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Elaf Restaurant combines customer ordering with kitchen display systems (KDS), dispatch operations, and management analytics.
                  The platform uses typed data contracts and structured schemas to prevent price tampering and race conditions.
                </p>
              </div>

              {/* 3-Tier Layer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h5 className="font-bold text-white text-sm">Client-Side Tier</h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    React 19 & Tailwind CSS SPA with responsive layouts, modal transitions, real-time cart computations, and QR dine-in support.
                  </p>
                  <ul className="text-[11px] text-zinc-400 space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Cart Context & Addon Engine</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Role-based views (Guest, Staff, Admin)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Responsive Touch-ready KDS controls</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h5 className="font-bold text-white text-sm">Business Logic & API Tier</h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    REST API endpoints with Zod request validation, server-side price recalibration, coupon code constraints, and order number generation.
                  </p>
                  <ul className="text-[11px] text-zinc-400 space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Server-side price recalculation</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Atomic state transition checks</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Multi-tender payment status management</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h5 className="font-bold text-white text-sm">PostgreSQL & Prisma Layer</h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Relational integrity with foreign key constraints, cascade deletes for custom order items, and indexed lookups for tracking orders.
                  </p>
                  <ul className="text-[11px] text-zinc-400 space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Relational tables & foreign keys</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unique constraints on orderNumber & slugs</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> JSON metadata snapshots for price history</li>
                  </ul>
                </div>
              </div>

              {/* Data Safety & Anti-Tampering Highlight */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300/90 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Why Prices Are Never Trusted from Frontend:
                </span>
                <p>
                  A critical rule in restaurant backends: client browsers only submit <code>menuItemId</code> and selected <code>addonIds</code>. The server queries the database price for each item, recalculates the subtotal, validates minimum coupon thresholds, applies delivery fees, and writes the verified total to <code>Order</code>.
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Prisma Schema */}
          {activeSection === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Prisma ORM Model Definitions (PostgreSQL)</h4>
                  <p className="text-xs text-zinc-400">
                    Defines strict relationships: Categories 1-to-N MenuItems, MenuItems 1-to-N Addons, Orders 1-to-N OrderItems.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(prismaSchemaCode, 'prisma')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white rounded-xl border border-zinc-700 transition-colors"
                >
                  {copiedCode === 'prisma' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'prisma' ? 'Copied!' : 'Copy Schema'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[450px]">
                  {prismaSchemaCode}
                </pre>
              </div>
            </div>
          )}

          {/* Section 3: API Endpoints */}
          {activeSection === 'api' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Key REST API Endpoints</h4>
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      POST /api/orders
                    </span>
                    <span className="text-[11px] text-zinc-400">Create new customer order</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Accepts items array, fulfillment type (DELIVERY | PICKUP | DINE_IN), table/address, payment method, and optional coupon code. Validates with Zod, calculates live totals, and returns generated order with <code>ELAF-XXXX</code> tracking ID.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                      GET /api/orders/track/:orderNumber
                    </span>
                    <span className="text-[11px] text-zinc-400">Public customer tracking lookup</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Returns real-time status, timeline milestones, delivery address or table assignment, items list, and calculated wait estimate without exposing sensitive payment credentials.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      PATCH /api/orders/:id/status
                    </span>
                    <span className="text-[11px] text-zinc-400">Kitchen & Dispatch Transition (Staff/Admin)</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Requires staff authentication. Updates status along the state machine (e.g., CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → COMPLETED).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                      POST /api/coupons/validate
                    </span>
                    <span className="text-[11px] text-zinc-400">Validate promo code</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Checks active status, expiry timestamp, usage limits, and minimum order basket threshold. Returns discount amount for instant client previews.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Kitchen Order State Machine */}
          {activeSection === 'lifecycle' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-white text-sm">Order Status Lifecycle</h4>
                <p className="text-xs text-zinc-400">
                  Each order transitions through well-defined stages with real-time updates:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-rose-900/40 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                    1. PENDING
                  </span>
                  <h5 className="font-bold text-white text-xs pt-1">Placed by Customer</h5>
                  <p className="text-[11px] text-zinc-400">
                    Order received. KDS sounds chime and alerts front-of-house staff for approval.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-blue-900/40 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                    2. CONFIRMED
                  </span>
                  <h5 className="font-bold text-white text-xs pt-1">Accepted by Staff</h5>
                  <p className="text-[11px] text-zinc-400">
                    Kitchen confirms inventory availability and queues order in prep station.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-amber-900/40 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                    3. PREPARING
                  </span>
                  <h5 className="font-bold text-white text-xs pt-1">Flame-Grilling & Cooking</h5>
                  <p className="text-[11px] text-zinc-400">
                    Chefs fire marinades, flame-grill chicken, and assemble side dishes fresh.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-purple-900/40 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-800">
                    4. READY
                  </span>
                  <h5 className="font-bold text-white text-xs pt-1">Plated & Packaged</h5>
                  <p className="text-[11px] text-zinc-400">
                    Food inspected at expeditor pass. Thermal packaging applied for drivers or pickup guests.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-cyan-900/40 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                    5. OUT_FOR_DELIVERY
                  </span>
                  <h5 className="font-bold text-white text-xs pt-1">En Route (Delivery)</h5>
                  <p className="text-[11px] text-zinc-400">
                    Driver dispatched with insulated thermal bag. Customer tracker shows road status.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-900/40 space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    6. COMPLETED
                  </span>
                  <h5 className="font-bold text-white text-xs pt-1">Delivered & Fulfilled</h5>
                  <p className="text-[11px] text-zinc-400">
                    Guest receives meal and is invited to rate and review their culinary experience.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Elaf Restaurant Engine v1.0 • Enterprise Full-Stack Spec</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
