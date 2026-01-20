import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Download,
  FileText,
  TrendingUp,
  Package,
  Calendar,
  Filter,
  FileSpreadsheet,
  File,
} from "lucide-react";
import type { SalesReport, TaxReport, InventoryReport } from "../../types";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"sales" | "tax" | "inventory">(
    "sales",
  );
  const [period, setPeriod] = useState<
    "today" | "week" | "month" | "quarter" | "year" | "custom"
  >("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Mock data
  const salesReports: SalesReport[] = [
    {
      date: "2024-01-20",
      totalOrders: 45,
      totalRevenue: 675000,
      totalCommission: 67500,
      netRevenue: 594000,
      averageOrderValue: 15000,
    },
    {
      date: "2024-01-19",
      totalOrders: 52,
      totalRevenue: 780000,
      totalCommission: 78000,
      netRevenue: 686400,
      averageOrderValue: 15000,
    },
  ];

  const taxReports: TaxReport[] = [
    {
      period: "January 2024",
      totalSales: 2450000,
      taxableAmount: 2450000,
      taxCollected: 183750,
      taxRate: 7.5,
    },
  ];

  const inventoryReports: InventoryReport[] = [
    {
      productId: "prod-001",
      productName: "Fresh Tomatoes",
      sku: "VEG-TOM-001",
      currentStock: 45,
      stockValue: 22500,
      soldUnits: 155,
      restockNeeded: true,
    },
    {
      productId: "prod-002",
      productName: "Red Onions",
      sku: "VEG-ONI-001",
      currentStock: 120,
      stockValue: 48000,
      soldUnits: 80,
      restockNeeded: false,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting ${reportType} report as ${format}`);
    // Implement export logic
  };

  const generateReport = () => {
    console.log("Generating report...", {
      reportType,
      period,
      startDate,
      endDate,
    });
    // Implement report generation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive business reports
          </p>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Report Configuration
          </CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="sales">Sales Report</option>
                <option value="tax">Tax Report</option>
                <option value="inventory">Inventory Report</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={generateReport} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {period === "custom" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <File className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Report */}
      {reportType === "sales" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Sales Report
            </CardTitle>
            <CardDescription>Daily sales performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">
                  {salesReports.reduce((sum, r) => sum + r.totalOrders, 0)}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    salesReports.reduce((sum, r) => sum + r.totalRevenue, 0),
                  )}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Net Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    salesReports.reduce((sum, r) => sum + r.netRevenue, 0),
                  )}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    salesReports.reduce(
                      (sum, r) => sum + r.averageOrderValue,
                      0,
                    ) / salesReports.length,
                  )}
                </p>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Date</th>
                    <th className="text-right p-3 text-sm font-medium">
                      Orders
                    </th>
                    <th className="text-right p-3 text-sm font-medium">
                      Revenue
                    </th>
                    <th className="text-right p-3 text-sm font-medium">
                      Commission
                    </th>
                    <th className="text-right p-3 text-sm font-medium">
                      Net Revenue
                    </th>
                    <th className="text-right p-3 text-sm font-medium">
                      Avg Order
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesReports.map((report) => (
                    <tr key={report.date} className="border-t hover:bg-accent">
                      <td className="p-3">{formatDate(report.date)}</td>
                      <td className="p-3 text-right">{report.totalOrders}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(report.totalRevenue)}
                      </td>
                      <td className="p-3 text-right text-red-600">
                        -{formatCurrency(report.totalCommission)}
                      </td>
                      <td className="p-3 text-right font-semibold">
                        {formatCurrency(report.netRevenue)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(report.averageOrderValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Report */}
      {reportType === "tax" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Tax Report
            </CardTitle>
            <CardDescription>
              Tax collection and compliance summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {taxReports.map((report) => (
                <div key={report.period} className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-lg font-semibold">{report.period}</h3>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Tax Statement
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Total Sales
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(report.totalSales)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Taxable Amount
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(report.taxableAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tax Collected (VAT {report.taxRate}%)
                        </p>
                        <p className="text-3xl font-bold text-primary mt-1">
                          {formatCurrency(report.taxCollected)}
                        </p>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                    <p>
                      <strong>Note:</strong> This report is for informational
                      purposes only. Please consult with a tax professional for
                      accurate tax filing and compliance.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Report */}
      {reportType === "inventory" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Inventory Report
            </CardTitle>
            <CardDescription>
              Stock levels and inventory value analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{inventoryReports.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Total Stock Value
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    inventoryReports.reduce((sum, r) => sum + r.stockValue, 0),
                  )}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Restock Needed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inventoryReports.filter((r) => r.restockNeeded).length}
                </p>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">
                      Product
                    </th>
                    <th className="text-left p-3 text-sm font-medium">SKU</th>
                    <th className="text-right p-3 text-sm font-medium">
                      Stock
                    </th>
                    <th className="text-right p-3 text-sm font-medium">
                      Value
                    </th>
                    <th className="text-right p-3 text-sm font-medium">Sold</th>
                    <th className="text-center p-3 text-sm font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryReports.map((report) => (
                    <tr
                      key={report.productId}
                      className="border-t hover:bg-accent"
                    >
                      <td className="p-3 font-medium">{report.productName}</td>
                      <td className="p-3 text-muted-foreground">
                        {report.sku}
                      </td>
                      <td className="p-3 text-right">{report.currentStock}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(report.stockValue)}
                      </td>
                      <td className="p-3 text-right">{report.soldUnits}</td>
                      <td className="p-3 text-center">
                        {report.restockNeeded ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Restock Needed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
