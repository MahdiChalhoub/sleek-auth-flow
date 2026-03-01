

## Fix: React Error #31 - Object rendered as React child on Stock Adjustments page

### Problem
Navigating to `/stock-adjustments` crashes the app with a blank screen. The `StockAdjustmentTable` component directly renders `{product.category}` in JSX (lines 68 and 131), but `product.category` is an object `{id: string, name: string}`, not a string. React cannot render objects as children.

### Root Cause
- `StockAdjustments.tsx` passes `mockProducts` from `src/models/product.ts` to `StockAdjustmentTable`
- Each mock product has `category: { id: "cat-001", name: "Electronics" }` (an object)
- `StockAdjustmentTable.tsx` renders `{product.category}` directly in two places (lines 68 and 131)
- This works in development mode (React shows a warning) but crashes in the production build (React error #31)

### Fix (1 file)

**`src/components/inventory/StockAdjustmentTable.tsx`** - Replace direct object rendering with safe string extraction:

- **Line 68**: Change `<p>{product.category}</p>` to render the category name:
  ```tsx
  <p>{typeof product.category === 'object' && product.category ? product.category.name : String(product.category || 'Uncategorized')}</p>
  ```

- **Line 131**: Change `<TableCell>{product.category}</TableCell>` similarly:
  ```tsx
  <TableCell>{typeof product.category === 'object' && product.category ? product.category.name : String(product.category || 'Uncategorized')}</TableCell>
  ```

This safely handles both cases: when `category` is an object `{id, name}` and when it might be a plain string.

