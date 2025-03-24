
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  UserPlus, 
  Pause,
  X, 
  ScanBarcode, 
  Percent,
  Printer, 
  Mail,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/POS/ProductCard";
import CartItem from "@/components/POS/CartItem";
import PaymentMethodSelector from "@/components/POS/PaymentMethodSelector";
import ClientSelector from "@/components/POS/ClientSelector";
import CategorySidebar from "@/components/POS/CategorySidebar";
import SecurityCheckDialog from "@/components/POS/SecurityCheckDialog";
import { mockProducts, Product } from "@/models/product";

const POSSales = () => {
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<{product: Product, quantity: number, discount: number}[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amountReceived, setAmountReceived] = useState<string>("");
  
  // Security dialog state
  const [securityDialog, setSecurityDialog] = useState<{
    isOpen: boolean;
    actionType: 'delete' | 'discount';
    callback: () => void;
  }>({
    isOpen: false,
    actionType: 'delete',
    callback: () => {}
  });
  
  // Handle security check requests
  const requireSecurityCheck = (actionType: 'delete' | 'discount', callback: () => void) => {
    setSecurityDialog({
      isOpen: true,
      actionType,
      callback
    });
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category === null) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    let filtered = products;
    
    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (query.trim() !== "") {
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.barcode.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  };
  
  // Handle barcode input
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (barcodeInput.trim() === "") return;
    
    const product = products.find(p => p.barcode === barcodeInput);
    
    if (product) {
      addToCart(product);
      toast.success(`Added ${product.name} to cart`);
    } else {
      toast.error("Product not found");
    }
    
    setBarcodeInput("");
    
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };
  
  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Product doesn't exist, add new item
        return [...prevCart, { product, quantity: 1, discount: 0 }];
      }
    });
  };
  
  // Update cart item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Update item discount
  const updateItemDiscount = (productId: string, discount: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, discount } 
          : item
      )
    );
  };
  
  // Apply global discount with security check
  const handleGlobalDiscount = (value: number) => {
    requireSecurityCheck('discount', () => {
      setGlobalDiscount(value);
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.product.price * item.quantity;
      const itemDiscount = itemPrice * (item.discount / 100);
      return total + (itemPrice - itemDiscount);
    }, 0);
  };
  
  // Calculate global discount amount
  const calculateGlobalDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (globalDiscount / 100);
  };
  
  // Calculate grand total
  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const globalDiscountAmount = calculateGlobalDiscountAmount();
    return subtotal - globalDiscountAmount;
  };
  
  // Calculate change amount
  const calculateChangeAmount = () => {
    const grandTotal = calculateGrandTotal();
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - grandTotal);
  };
  
  // Calculate amount due
  const calculateAmountDue = () => {
    const grandTotal = calculateGrandTotal();
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, grandTotal - received);
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    setGlobalDiscount(0);
    setAmountReceived("");
  };
  
  // Hold sale
  const holdSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    toast.success("Sale held successfully");
    // In a real app, you would save the sale to a database
  };
  
  // Cancel sale
  const cancelSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    clearCart();
    toast.info("Sale cancelled");
  };
  
  // Process payment
  const processPayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    setIsPaymentModalOpen(true);
  };
  
  // Print invoice
  const printInvoice = () => {
    toast.success("Printing invoice...");
    // In a real app, you would generate and print an invoice
  };
  
  // Email invoice
  const emailInvoice = () => {
    toast.success("Emailing invoice...");
    // In a real app, you would generate and email an invoice
  };
  
  // Focus barcode input when component mounts
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);
  
  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+B for barcode focus
      if (e.altKey && e.key === 'b') {
        e.preventDefault();
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }
      
      // Alt+S for search focus
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      // Alt+P for payment
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        if (cart.length > 0) {
          processPayment();
        }
      }
      
      // Alt+H for hold sale
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        if (cart.length > 0) {
          holdSale();
        }
      }
      
      // Alt+C for cancel sale
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        if (cart.length > 0) {
          cancelSale();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cart]);
  
  // Calculate number of items in cart
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const grandTotal = calculateGrandTotal();
  const changeAmount = calculateChangeAmount();
  const amountDue = calculateAmountDue();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="p-4 border-b bg-white/80 dark:bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between max-w-[1920px] mx-auto">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link to="/home">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold">POS Sales</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-1.5" 
                onClick={() => setIsClientSelectorOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                {selectedClient ? selectedClient : "Guest Checkout"}
              </Button>
              
              <Button 
                variant="default" 
                className="gap-1.5"
                onClick={processPayment}
              >
                <DollarSign className="h-4 w-4" />
                Payment
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side: Products and Categories */}
          <div className="w-full lg:w-3/5 flex">
            {/* Category Sidebar */}
            <CategorySidebar 
              onSelectCategory={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
            
            {/* Products Section */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Search and Barcode Input */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    ref={searchInputRef}
                    placeholder="Search products..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <form onSubmit={handleBarcodeSubmit} className="relative flex-1">
                  <ScanBarcode className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    ref={barcodeInputRef}
                    placeholder="Scan barcode (Alt+B)" 
                    className="pl-9"
                    value={barcodeInput}
                    onChange={e => setBarcodeInput(e.target.value)}
                  />
                </form>
              </div>
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => addToCart(product)} 
                  />
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <Search className="h-10 w-10 mb-2 opacity-20" />
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Cart Section (Right Side) */}
          <div className="hidden lg:block lg:w-2/5 bg-white/60 dark:bg-black/30 backdrop-blur-lg border-l overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({itemCount} items)
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  Clear All
                </Button>
              </div>
              
              {/* Cart Items */}
              <ScrollArea className="flex-grow p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div>
                    {cart.map(item => (
                      <CartItem 
                        key={item.product.id} 
                        item={item} 
                        onUpdateQuantity={updateQuantity} 
                        onRemove={removeFromCart}
                        onUpdateDiscount={updateItemDiscount}
                        requireSecurityCheck={requireSecurityCheck}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {/* Cart Footer */}
              <div className="border-t p-4">
                {/* Global Discount */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span>Global Discount:</span>
                  </div>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      className="w-16 h-8 text-right"
                      value={globalDiscount}
                      onChange={(e) => handleGlobalDiscount(Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                
                {/* Amount Received */}
                <div className="flex items-center justify-between mb-3">
                  <span>Amount Received:</span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-2">$</span>
                    <Input 
                      type="number" 
                      className="pl-7 h-8 text-right"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>
                
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {/* Discount Amount */}
                {globalDiscount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Discount Amount:</span>
                    <span className="text-red-500">-${calculateGlobalDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                
                {/* Grand Total */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Grand Total:</span>
                  <span className="font-bold text-lg">${grandTotal.toFixed(2)}</span>
                </div>
                
                {/* Change Amount */}
                {changeAmount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 dark:text-green-400">Change:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">${changeAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Amount Due */}
                {amountDue > 0 && parseFloat(amountReceived) > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-600 dark:text-blue-400">Amount Due:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">${amountDue.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  <Button 
                    variant="outline" 
                    onClick={holdSale}
                    disabled={cart.length === 0}
                    className="w-full"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Hold
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={cancelSale}
                    disabled={cart.length === 0}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (barcodeInputRef.current) {
                        barcodeInputRef.current.focus();
                      }
                    }}
                    className="w-full"
                  >
                    <ScanBarcode className="h-4 w-4 mr-1" />
                    Scan
                  </Button>
                </div>
                
                {/* Payment Button */}
                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={processPayment}
                  disabled={cart.length === 0}
                >
                  <DollarSign className="h-5 w-5 mr-1" />
                  Process Payment (${grandTotal.toFixed(2)})
                </Button>
                
                {/* Invoice Options */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={printInvoice}
                    disabled={cart.length === 0}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={emailInvoice}
                    disabled={cart.length === 0}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Cart Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-10">
            <Button 
              size="icon" 
              className="h-16 w-16 rounded-full shadow-lg"
              onClick={() => {
                // In a real app, you would show a mobile cart modal
                toast.info("Mobile cart coming soon");
              }}
            >
              <div className="relative">
                <ShoppingCart className="h-7 w-7" />
                {itemCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </div>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Client Selector Modal */}
      <ClientSelector 
        isOpen={isClientSelectorOpen} 
        onClose={() => setIsClientSelectorOpen(false)}
        onSelect={(client) => {
          setSelectedClient(client);
          setIsClientSelectorOpen(false);
          toast.success(`Selected client: ${client}`);
        }}
      />
      
      {/* Payment Modal */}
      <PaymentMethodSelector 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={grandTotal}
        onPaymentComplete={() => {
          setIsPaymentModalOpen(false);
          clearCart();
          toast.success("Payment processed successfully");
        }}
      />
      
      {/* Security Check Dialog */}
      <SecurityCheckDialog
        isOpen={securityDialog.isOpen}
        onClose={() => setSecurityDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={securityDialog.callback}
        actionType={securityDialog.actionType}
      />
    </div>
  );
};

export default POSSales;
