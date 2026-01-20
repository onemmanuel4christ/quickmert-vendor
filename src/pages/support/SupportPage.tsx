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
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Book,
  Video,
  AlertCircle,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import type { SupportTicket, FAQ } from "../../types";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"help" | "tickets" | "contact">(
    "help",
  );
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "technical" as const,
    priority: "medium" as const,
    description: "",
  });

  // Mock data
  const tickets: SupportTicket[] = [
    {
      id: "ticket-001",
      subject: "Payment not received",
      description: "My payout from last week hasn't arrived yet",
      category: "billing",
      priority: "high",
      status: "in_progress",
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-19T14:30:00Z",
      responses: [
        {
          id: "resp-001",
          ticketId: "ticket-001",
          message:
            "We're looking into this issue. Your payment was processed on Jan 16.",
          isVendorResponse: false,
          createdAt: "2024-01-19T14:30:00Z",
        },
      ],
    },
    {
      id: "ticket-002",
      subject: "How to add product variants?",
      description: "I need help adding size variants to my products",
      category: "product",
      priority: "low",
      status: "resolved",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-01-15T16:00:00Z",
      responses: [],
    },
  ];

  const faqs: FAQ[] = [
    {
      id: "faq-001",
      question: "How do I add a new product?",
      answer:
        "To add a new product, go to the Products page and click the 'Add Product' button. Fill in all required information including name, description, price, and upload product images. Don't forget to set the stock quantity and category.",
      category: "Products",
      helpful: 45,
    },
    {
      id: "faq-002",
      question: "When do I receive my payouts?",
      answer:
        "Payouts are processed weekly every Monday for orders completed in the previous week. The funds typically arrive in your bank account within 2-3 business days. You can track your payout status in the Finances section.",
      category: "Payments",
      helpful: 38,
    },
    {
      id: "faq-003",
      question: "How do I manage my inventory?",
      answer:
        "Navigate to the Inventory page to see all your products and their stock levels. You can update stock quantities individually or use bulk operations. Set up low stock alerts to get notified when items need restocking.",
      category: "Inventory",
      helpful: 32,
    },
    {
      id: "faq-004",
      question: "What are the commission rates?",
      answer:
        "QuickMart charges a 10% commission on each sale plus a 2% payment processing fee. For example, on a ₦10,000 sale, you'll receive ₦8,800 after deducting ₦1,000 commission and ₦200 processing fee.",
      category: "Payments",
      helpful: 56,
    },
    {
      id: "faq-005",
      question: "How do I complete KYC verification?",
      answer:
        "Go to Settings > Account Details to complete your KYC. You'll need to provide personal information, business details, bank account information, and upload identity and business documents. Verification typically takes 2-3 business days.",
      category: "Account",
      helpful: 41,
    },
  ];

  const tutorials = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new vendors",
      duration: "15 min",
      icon: Book,
    },
    {
      title: "Managing Orders Efficiently",
      description: "Tips for faster order processing",
      duration: "8 min",
      icon: Video,
    },
    {
      title: "Inventory Best Practices",
      description: "Optimize your stock management",
      duration: "12 min",
      icon: Book,
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    const config = {
      open: { variant: "secondary" as const, icon: Clock, text: "Open" },
      in_progress: {
        variant: "default" as const,
        icon: AlertCircle,
        text: "In Progress",
      },
      resolved: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Resolved",
      },
      closed: { variant: "secondary" as const, icon: XCircle, text: "Closed" },
    };
    const { variant, icon: Icon, text } = config[status as keyof typeof config];
    return (
      <Badge variant={variant}>
        <Icon className="h-3 w-3 mr-1" />
        {text}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "text-gray-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const handleSubmitTicket = () => {
    console.log("Submitting ticket:", newTicket);
    setNewTicket({
      subject: "",
      category: "technical",
      priority: "medium",
      description: "",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Support & Help</h1>
          <p className="text-muted-foreground">
            Get help, find answers, and contact support
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-sm text-muted-foreground">
                  support@quickmart.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Phone Support</p>
                <p className="text-sm text-muted-foreground">
                  +234 800 123 4567
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Live Chat</p>
                <p className="text-sm text-muted-foreground">
                  Available 9 AM - 6 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: "help", label: "Help Center", icon: HelpCircle },
          { id: "tickets", label: "My Tickets", icon: MessageSquare },
          { id: "contact", label: "Contact Support", icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Help Center Tab */}
      {activeTab === "help" && (
        <div className="space-y-6">
          {/* Tutorials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5" />
                Video Tutorials & Guides
              </CardTitle>
              <CardDescription>
                Learn how to use the platform effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {tutorials.map((tutorial) => {
                  const Icon = tutorial.icon;
                  return (
                    <div
                      key={tutorial.title}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {tutorial.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {tutorial.duration}
                            </span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(isExpanded ? null : faq.id)
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant="secondary">{faq.category}</Badge>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="p-4 pt-0 border-t bg-muted/30">
                          <p className="text-muted-foreground mb-3">
                            {faq.answer}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Was this helpful?
                            </span>
                            <Button variant="outline" size="sm">
                              👍 Yes ({faq.helpful})
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 No
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  View and manage your support requests
                </CardDescription>
              </div>
              <Button onClick={() => setActiveTab("contact")}>
                <Send className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                        <Badge
                          variant="outline"
                          className={getPriorityColor(ticket.priority)}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {ticket.id}</span>
                        <span>Created: {formatDate(ticket.createdAt)}</span>
                        <span>Updated: {formatDate(ticket.updatedAt)}</span>
                        {ticket.responses.length > 0 && (
                          <span>{ticket.responses.length} response(s)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Support Tab */}
      {activeTab === "contact" && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Support Ticket</CardTitle>
            <CardDescription>
              Describe your issue and we'll get back to you as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, subject: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket({
                      ...newTicket,
                      category: e.target.value as any,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="product">Product Management</option>
                  <option value="account">Account & Settings</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <select
                  id="priority"
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({
                      ...newTicket,
                      priority: e.target.value as any,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue..."
                rows={6}
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmitTicket}>
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Attach Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
