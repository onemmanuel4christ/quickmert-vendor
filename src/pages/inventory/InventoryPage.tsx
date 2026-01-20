import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { mockApi } from "../../services/mockData";
import type { InventoryItem } from "../../types";
import {
  Search,
  AlertTriangle,
  Package,
  TrendingDown,
  Plus,
  Minus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Filter,
} from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "low" | "out">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStock, setEditingStock] = useState<{
    id: string;
    value: number;
  } | null>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        // Add all products to inventory view
        const products = await mockApi.getProducts();
        const fullInventory: InventoryItem[] = products.map((p) => ({
          id: p.id,
          productId: p.id,
          productName: p.name,
          slug: p.slug,
          currentStock: p.stock,
          lowStockThreshold: 20,
          size: p.size,
          unit: p.unit || "pcs",
          tags: p.tags,
          lastUpdated: p.updatedAt,
        }));
        setInventory(fullInventory);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Apply filters
  let filteredInventory = inventory.filter((item) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (filterType === "low") {
    filteredInventory = filteredInventory.filter(
      (item) =>
        item.currentStock <= item.lowStockThreshold && item.currentStock > 0,
    );
  } else if (filterType === "out") {
    filteredInventory = filteredInventory.filter(
      (item) => item.currentStock === 0,
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const lowStockItems = inventory.filter(
    (item) => item.currentStock <= item.lowStockThreshold,
  );

  const totalItems = inventory.length;
  const totalStock = inventory.reduce(
    (sum, item) => sum + item.currentStock,
    0,
  );

  const adjustStock = (itemId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentStock: Math.max(0, item.currentStock + amount),
              lastUpdated: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const updateStock = (itemId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentStock: Math.max(0, newStock),
              lastUpdated: new Date().toISOString(),
            }
          : item,
      ),
    );
    setEditingStock(null);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return "out";
    if (item.currentStock <= item.lowStockThreshold) return "low";
    return "good";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your product stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Units in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter((item) => item.currentStock === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Items unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as "all" | "low" | "out")
                }
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Size
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Unit
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Current Stock
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Low Stock Alert
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Stock Level
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map((item) => {
                  const status = getStockStatus(item);
                  const stockPercentage =
                    (item.currentStock / item.lowStockThreshold) * 100;

                  return (
                    <tr
                      key={item.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            {item.slug && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {item.slug}
                              </p>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {item.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs px-1 py-0"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Last updated:{" "}
                              {new Date(item.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        {item.size ? (
                          <Badge variant="outline">{item.size}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-center">
                        <Badge variant="secondary">{item.unit}</Badge>
                      </td>
                      <td className="p-4 align-middle text-center">
                        {editingStock?.id === item.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={editingStock.value}
                              onChange={(e) =>
                                setEditingStock({
                                  id: item.id,
                                  value: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-20 h-8 text-center"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() =>
                                updateStock(item.id, editingStock.value)
                              }
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-semibold">
                              {item.currentStock}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setEditingStock({
                                  id: item.id,
                                  value: item.currentStock,
                                })
                              }
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-middle text-center">
                        <span className="text-sm">
                          {item.lowStockThreshold}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-center">
                        {status === "out" && (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                        {status === "low" && (
                          <Badge variant="warning" className="gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        )}
                        {status === "good" && (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="w-full px-4">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                status === "out"
                                  ? "bg-destructive"
                                  : status === "low"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(stockPercentage, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => adjustStock(item.id, -10)}
                            disabled={item.currentStock === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => adjustStock(item.id, 10)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredInventory.length > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredInventory.length)} of{" "}
                {filteredInventory.length} items
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
