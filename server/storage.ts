import { activities, categories, orderItems, orders, products, suppliers, type Activity, type Category, type InsertActivity, type InsertCategory, type InsertOrder, type InsertOrderItem, type InsertProduct, type InsertSupplier, type Order, type OrderItem, type Product, type Supplier, ActivityTypes } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductStock(id: number, newStock: number): Promise<Product | undefined>;
  
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getActiveOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Dashboard
  getDashboardStats(): Promise<{ totalProducts: number; lowStockItems: number; activeOrders: number; totalSuppliers: number }>;
  
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private suppliers: Map<number, Supplier>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private activities: Activity[];
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentSupplierId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.suppliers = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.activities = [];
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentSupplierId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentActivityId = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Create categories
    const electronics = this.createCategory({ name: "Electronics", description: "Electronic devices and gadgets" });
    const accessories = this.createCategory({ name: "Accessories", description: "Various accessories for devices" });
    const wearables = this.createCategory({ name: "Wearables", description: "Wearable smart devices" });
    const audio = this.createCategory({ name: "Audio", description: "Audio equipment and accessories" });
    
    // Create suppliers
    const techSupplier = this.createSupplier({ 
      name: "TechSource Inc.", 
      contactName: "John Smith", 
      email: "john@techsource.com", 
      phone: "555-123-4567", 
      address: "123 Tech Blvd, Silicon Valley, CA" 
    });
    
    this.createSupplier({ 
      name: "GlobalGadgets", 
      contactName: "Jane Doe", 
      email: "jane@globalgadgets.com", 
      phone: "555-987-6543", 
      address: "456 Gadget Ave, New York, NY" 
    });
    
    // Create products
    this.createProduct({
      name: "Laptop Pro 15-inch",
      sku: "PRD-56789",
      description: "High-performance laptop with 15-inch display",
      price: 1299.00,
      stock: 24,
      minStockLevel: 10,
      categoryId: electronics.id,
      imageUrl: "/laptop.jpg"
    });
    
    this.createProduct({
      name: "Smartphone XS",
      sku: "PRD-67890",
      description: "Latest smartphone with advanced features",
      price: 899.00,
      stock: 45,
      minStockLevel: 15,
      categoryId: electronics.id,
      imageUrl: "/smartphone.jpg"
    });
    
    this.createProduct({
      name: "Wireless Headphones",
      sku: "PRD-12345",
      description: "Noise-cancelling wireless headphones",
      price: 199.00,
      stock: 5,
      minStockLevel: 10,
      categoryId: audio.id,
      imageUrl: "/headphones.jpg"
    });
    
    this.createProduct({
      name: "Smart Watch",
      sku: "PRD-98765",
      description: "Fitness tracking smart watch",
      price: 249.00,
      stock: 8,
      minStockLevel: 15,
      categoryId: wearables.id,
      imageUrl: "/smartwatch.jpg"
    });
    
    this.createProduct({
      name: "USB-C Charging Cable",
      sku: "PRD-45678",
      description: "Fast charging USB-C cable",
      price: 19.99,
      stock: 12,
      minStockLevel: 20,
      categoryId: accessories.id,
      imageUrl: "/cable.jpg"
    });
    
    this.createProduct({
      name: "Wireless Charging Pad",
      sku: "PRD-34567",
      description: "Qi-compatible wireless charging pad",
      price: 49.00,
      stock: 32,
      minStockLevel: 10,
      categoryId: accessories.id,
      imageUrl: "/chargingpad.jpg"
    });
    
    // Create an order
    const order = this.createOrder({
      orderNumber: "ORD-2023-8754",
      supplierId: techSupplier.id,
      status: "pending"
    }, []);
    
    // Add activities
    this.createActivity({
      type: ActivityTypes.PRODUCT_ADDED,
      description: "New product added: Laptop Pro 15-inch",
      entityId: 1,
      entityType: "product"
    });
    
    this.createActivity({
      type: ActivityTypes.STOCK_UPDATED,
      description: "Inventory updated for Bluetooth Speakers",
      entityId: 3,
      entityType: "product"
    });
    
    this.createActivity({
      type: ActivityTypes.LOW_STOCK_ALERT,
      description: "Low stock alert for Wireless Headphones",
      entityId: 3,
      entityType: "product"
    });
    
    this.createActivity({
      type: ActivityTypes.ORDER_PLACED,
      description: "New order #ORD-2023-8754 placed",
      entityId: order.id,
      entityType: "order"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.categoryId === categoryId
    );
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.stock <= product.minStockLevel
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const createdAt = new Date();
    const newProduct: Product = { ...product, id, createdAt };
    this.products.set(id, newProduct);
    
    // Create activity
    this.createActivity({
      type: ActivityTypes.PRODUCT_ADDED,
      description: `New product added: ${product.name}`,
      entityId: id,
      entityType: "product"
    });
    
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    
    // Create activity
    this.createActivity({
      type: ActivityTypes.PRODUCT_UPDATED,
      description: `Product updated: ${updatedProduct.name}`,
      entityId: id,
      entityType: "product"
    });
    
    return updatedProduct;
  }

  async updateProductStock(id: number, newStock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, stock: newStock };
    this.products.set(id, updatedProduct);
    
    // Create activity
    this.createActivity({
      type: ActivityTypes.STOCK_UPDATED,
      description: `Stock updated for ${product.name}: ${newStock} units`,
      entityId: id,
      entityType: "product"
    });
    
    // Check if stock level is low
    if (newStock <= product.minStockLevel) {
      this.createActivity({
        type: ActivityTypes.LOW_STOCK_ALERT,
        description: `Low stock alert for ${product.name}: ${newStock} units`,
        entityId: id,
        entityType: "product"
      });
    }
    
    return updatedProduct;
  }

  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplierById(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentSupplierId++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getActiveOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.status === "pending"
    );
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.currentOrderId++;
    const createdAt = new Date();
    const newOrder: Order = { ...order, id, createdAt };
    this.orders.set(id, newOrder);
    
    // Create order items
    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const itemId = this.currentOrderItemId++;
      const orderItem: OrderItem = { ...item, id: itemId, orderId: id };
      orderItems.push(orderItem);
      
      // Update product stock when order is received
      if (order.status === "received") {
        const product = await this.getProductById(item.productId);
        if (product) {
          await this.updateProductStock(product.id, product.stock + item.quantity);
        }
      }
    }
    
    this.orderItems.set(id, orderItems);
    
    // Create activity
    this.createActivity({
      type: ActivityTypes.ORDER_PLACED,
      description: `New order ${order.orderNumber} placed`,
      entityId: id,
      entityType: "order"
    });
    
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    
    // Create activity
    if (status === "received") {
      // Update product stock when order is received
      const items = await this.getOrderItems(id);
      for (const item of items) {
        const product = await this.getProductById(item.productId);
        if (product) {
          await this.updateProductStock(product.id, product.stock + item.quantity);
        }
      }
      
      this.createActivity({
        type: ActivityTypes.ORDER_RECEIVED,
        description: `Order ${order.orderNumber} received`,
        entityId: id,
        entityType: "order"
      });
    } else if (status === "cancelled") {
      this.createActivity({
        type: ActivityTypes.ORDER_CANCELLED,
        description: `Order ${order.orderNumber} cancelled`,
        entityId: id,
        entityType: "order"
      });
    }
    
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) || [];
  }

  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = [...this.activities].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const createdAt = new Date();
    const newActivity: Activity = { ...activity, id, createdAt };
    this.activities.push(newActivity);
    return newActivity;
  }

  // Dashboard methods
  async getDashboardStats(): Promise<{ totalProducts: number; lowStockItems: number; activeOrders: number; totalSuppliers: number }> {
    const products = await this.getProducts();
    const lowStockProducts = await this.getLowStockProducts();
    const activeOrders = await this.getActiveOrders();
    const suppliers = await this.getSuppliers();
    
    return {
      totalProducts: products.length,
      lowStockItems: lowStockProducts.length,
      activeOrders: activeOrders.length,
      totalSuppliers: suppliers.length
    };
  }
}

export const storage = new MemStorage();
