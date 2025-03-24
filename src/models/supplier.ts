
import { Product } from "@/models/product";

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  products: string[]; // Product IDs this supplier provides
}

// Mock suppliers data
export const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Apple Inc.",
    contactPerson: "Tim Cook",
    email: "supplier@apple.com",
    phone: "1-800-275-2273",
    address: "One Apple Park Way, Cupertino, CA 95014, USA",
    taxId: "123-45-6789",
    paymentTerms: "Net 30",
    notes: "Premium supplier for all Apple products",
    products: ["1", "2", "3", "5"]
  },
  {
    id: "SUP-002",
    name: "Samsung Electronics",
    contactPerson: "Jong-Hee Han",
    email: "supplier@samsung.com",
    phone: "1-800-726-7864",
    address: "129 Samsung-ro, Yeongtong-gu, Suwon-si, South Korea",
    taxId: "987-65-4321",
    paymentTerms: "Net 45",
    notes: "Main supplier for Samsung mobile devices",
    products: ["4"]
  },
  {
    id: "SUP-003",
    name: "Sony Electronics",
    contactPerson: "Kenichiro Yoshida",
    email: "supplier@sony.com",
    phone: "1-800-222-7669",
    address: "1-7-1 Konan, Minato-ku, Tokyo, Japan",
    taxId: "456-78-9012",
    paymentTerms: "Net 30",
    notes: "Supplier for headphones and electronic devices",
    products: ["6"]
  },
  {
    id: "SUP-004",
    name: "Organic Farms Co.",
    contactPerson: "Jane Smith",
    email: "jane@organicfarms.com",
    phone: "1-888-555-1234",
    address: "123 Farm Road, Fresno, CA 93706, USA",
    taxId: "234-56-7890",
    paymentTerms: "Net 15",
    notes: "Supplier for fresh organic produce",
    products: ["7"]
  },
  {
    id: "SUP-005",
    name: "Bean Brothers Coffee",
    contactPerson: "Mike Johnson",
    email: "mike@beanbrothers.com",
    phone: "1-877-555-2345",
    address: "456 Coffee Lane, Seattle, WA 98101, USA",
    taxId: "345-67-8901",
    paymentTerms: "Net 30",
    notes: "Premium coffee bean supplier",
    products: ["8"]
  },
  {
    id: "SUP-006",
    name: "Craft Brew Distributors",
    contactPerson: "Tom Wilson",
    email: "tom@craftbrewdist.com",
    phone: "1-866-555-3456",
    address: "789 Brewery Ave, Portland, OR 97209, USA",
    taxId: "456-78-9012",
    paymentTerms: "Net 30",
    notes: "Craft beer distributor",
    products: ["9"]
  }
];
