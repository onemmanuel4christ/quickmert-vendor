import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
} from "lucide-react";
import type {
  Transaction,
  Payout,
  FinancialSummary,
  Invoice,
} from "../../types";

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "payouts" | "invoices"
  >("overview");
  const [dateRange, setDateRange] = useState("30days");

  // Mock data - replace with actual API calls
  const summary: FinancialSummary = {
    totalEarnings: 2450000,
    pendingPayouts: 450000,
    completedPayouts: 2000000,
    totalCommission: 245000,
    totalFees: 49000,
    netEarnings: 2156000,
    period: "Last 30 days",
  };

  const transactions: Transaction[] = [
    {
      id: "txn-001",
      orderId: "ORD-20240120-001",
      amount: 15000,
      commission: 1500,
      platformFee: 300,
      netEarnings: 13200,
      paymentMethod: "Card Payment",
      status: "completed",
      createdAt: "2024-01-20T10:30:00Z",
      settledAt: "2024-01-20T10:35:00Z",
    },
    {
      id: "txn-002",
      orderId: "ORD-20240120-002",
      amount: 25000,
      commission: 2500,
      platformFee: 500,
      netEarnings: 22000,
      paymentMethod: "Cash on Delivery",
      status: "pending",
      createdAt: "2024-01-20T11:15:00Z",
    },
  ];

  const payouts: Payout[] = [
    {
      id: "pyt-001",
      amount: 500000,
      bankAccount: "Access Bank - 0123456789",
      status: "completed",
      scheduledDate: "2024-01-15",
      completedDate: "2024-01-16",
      reference: "PYT-20240115-001",
      transactionCount: 45,
    },
    {
      id: "pyt-002",
      amount: 450000,
      bankAccount: "Access Bank - 0123456789",
      status: "pending",
      scheduledDate: "2024-01-22",
      reference: "PYT-20240122-001",
      transactionCount: 38,
    },
  ];

  const invoices: Invoice[] = [
    {
      id: "inv-001",
      invoiceNumber: "INV-2024-001",
      orderId: "ORD-20240120-001",
      amount: 15000,
      tax: 1125,
      total: 16125,
      issuedDate: "2024-01-20",
      dueDate: "2024-02-20",
      status: "paid",
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      paid: "default",
      pending: "secondary",
      processing: "secondary",
      failed: "destructive",
      overdue: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Finances & Payouts</h1>
          <p className="text-muted-foreground">
            Manage your earnings, payouts, and invoices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This year</option>
          </select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% from last period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payouts
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.pendingPayouts)}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled for next payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.netEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              After commission & fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalCommission + summary.totalFees)}
            </div>
            <p className="text-xs text-muted-foreground">
              Commission: {formatCurrency(summary.totalCommission)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: "overview", label: "Overview" },
          { id: "transactions", label: "Transactions" },
          { id: "payouts", label: "Payouts" },
          { id: "invoices", label: "Invoices" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
              <CardDescription>
                Revenue distribution for {summary.period.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Gross Revenue
                </span>
                <span className="font-semibold">
                  {formatCurrency(summary.totalEarnings)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Platform Commission (10%)
                </span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(summary.totalCommission)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Processing Fees (2%)
                </span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(summary.totalFees)}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net Earnings</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(summary.netEarnings)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Performance</CardTitle>
              <CardDescription>
                Transaction breakdown by payment type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  method: "Card Payment",
                  amount: 1200000,
                  count: 145,
                  percentage: 49,
                },
                {
                  method: "Cash on Delivery",
                  amount: 800000,
                  count: 98,
                  percentage: 33,
                },
                {
                  method: "Bank Transfer",
                  amount: 450000,
                  count: 42,
                  percentage: 18,
                },
              ].map((method) => (
                <div key={method.method} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{method.method}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(method.amount)} ({method.count} orders)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All your order transactions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.orderId}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.paymentMethod} •{" "}
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(transaction.netEarnings)}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payouts Tab */}
      {activeTab === "payouts" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>
                  Track your scheduled and completed payouts
                </CardDescription>
              </div>
              <Button>Request Payout</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      {payout.status === "completed" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : payout.status === "failed" ? (
                        <XCircle className="h-6 w-6 text-red-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{payout.reference}</p>
                      <p className="text-sm text-muted-foreground">
                        {payout.bankAccount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {payout.transactionCount} transactions • Scheduled:{" "}
                        {formatDate(payout.scheduledDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {formatCurrency(payout.amount)}
                    </p>
                    {getStatusBadge(payout.status)}
                    {payout.completedDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed: {formatDate(payout.completedDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Generate and manage invoices</CardDescription>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Order: {invoice.orderId} • Issued:{" "}
                        {formatDate(invoice.issuedDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(invoice.total)}
                      </p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
