import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { mockApi } from "../../services/mockData";
import { useAuthStore } from "../../stores/authStore";
import { useToast } from "../../components/ui/toast";
import type { StoreSettings, VendorKYC, BankAccount } from "../../types";
import {
  Store,
  Clock,
  MapPin,
  Save,
  Power,
  PowerOff,
  User,
  Briefcase,
  CreditCard,
  FileText,
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
  Building2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "store" | "account" | "kyc" | "bank" | "documents"
  >("store");
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [kycData, setKycData] = useState<VendorKYC | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await mockApi.getStoreSettings();
        setSettings(data);

        // Initialize KYC data (in production, fetch from API)
        setKycData({
          vendorId: user?.id || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          dateOfBirth: "",
          nationality: "Nigeria",
          phoneNumber: user?.phoneNumber || "",
          alternativePhone: "",
          businessInfo: {
            businessName: user?.storeName || "",
            businessType: "sole_proprietor",
            businessAddress: user?.address || "",
            businessCity: "",
            businessState: "",
            businessZipCode: "",
          },
          bankAccounts: [],
          businessDocuments: [],
          status: user?.kycStatus || "pending",
          lastUpdatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleKYCSubmit = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (kycData) {
        setKycData({
          ...kycData,
          status: "in_review",
          submittedAt: new Date().toISOString(),
        });
      }
      toast({
        title: "KYC Submitted",
        description: "Your KYC information has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit KYC. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addBankAccount = () => {
    if (!kycData) return;
    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: "",
      accountNumber: "",
      accountName: "",
      isPrimary: kycData.bankAccounts.length === 0,
      isVerified: false,
      currency: "NGN",
    };
    setKycData({
      ...kycData,
      bankAccounts: [...kycData.bankAccounts, newAccount],
    });
  };

  const removeBankAccount = (id: string) => {
    if (!kycData) return;
    setKycData({
      ...kycData,
      bankAccounts: kycData.bankAccounts.filter((acc) => acc.id !== id),
    });
  };

  const updateBankAccount = (
    id: string,
    field: keyof BankAccount,
    value: any,
  ) => {
    if (!kycData) return;
    setKycData({
      ...kycData,
      bankAccounts: kycData.bankAccounts.map((acc) =>
        acc.id === id ? { ...acc, [field]: value } : acc,
      ),
    });
  };

  const toggleStoreStatus = () => {
    setSettings((prev) => (prev ? { ...prev, isOpen: !prev.isOpen } : null));
  };

  const toggleVacationMode = () => {
    setSettings((prev) =>
      prev ? { ...prev, isVacationMode: !prev.isVacationMode } : null,
    );
  };

  const toggleDayStatus = (day: string) => {
    setSettings((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        operatingHours: prev.operatingHours.map((hour) =>
          hour.day === day ? { ...hour, isOpen: !hour.isOpen } : hour,
        ),
      };
    });
  };

  if (loading || !settings || !kycData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getKYCStatusBadge = () => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        icon: AlertCircle,
        text: "Pending Verification",
      },
      in_review: {
        variant: "default" as const,
        icon: Clock,
        text: "In Review",
      },
      verified: {
        variant: "success" as const,
        icon: CheckCircle,
        text: "Verified ✓",
      },
      rejected: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Rejected",
      },
    };
    const config = statusConfig[kycData.status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="text-sm">
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const tabs = [
    { id: "store" as const, label: "Store Settings", icon: Store },
    { id: "account" as const, label: "Account Details", icon: User },
    { id: "kyc" as const, label: "Business Info", icon: Briefcase },
    { id: "bank" as const, label: "Bank Accounts", icon: CreditCard },
    { id: "documents" as const, label: "Documents", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store, account, and verification details
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getKYCStatusBadge()}
          <Button
            onClick={
              activeTab === "kyc" ||
              activeTab === "bank" ||
              activeTab === "documents"
                ? handleKYCSubmit
                : handleSave
            }
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* KYC Alert Banner */}
      {kycData.status === "pending" && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Complete Your Verification
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  To receive payments and access full features, please complete
                  your business verification by providing your business
                  information, bank account details, and required documents.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-yellow-600 text-yellow-900 hover:bg-yellow-100"
                  onClick={() => setActiveTab("kyc")}
                >
                  Start Verification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Account Details Tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your personal details for account verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={kycData.firstName}
                    onChange={(e) =>
                      setKycData({ ...kycData, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={kycData.lastName}
                    onChange={(e) =>
                      setKycData({ ...kycData, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed here
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={kycData.phoneNumber}
                    onChange={(e) =>
                      setKycData({ ...kycData, phoneNumber: e.target.value })
                    }
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={kycData.dateOfBirth}
                    onChange={(e) =>
                      setKycData({ ...kycData, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <select
                    id="nationality"
                    value={kycData.nationality}
                    onChange={(e) =>
                      setKycData({ ...kycData, nationality: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternativePhone">
                  Alternative Phone (Optional)
                </Label>
                <Input
                  id="alternativePhone"
                  value={kycData.alternativePhone || ""}
                  onChange={(e) =>
                    setKycData({ ...kycData, alternativePhone: e.target.value })
                  }
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Business Info Tab (KYC) */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Provide your business registration details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business/Store Name *</Label>
                  <Input
                    id="businessName"
                    value={kycData.businessInfo.businessName}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          businessName: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <select
                    id="businessType"
                    value={kycData.businessInfo.businessType}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          businessType: e.target.value as any,
                        },
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="sole_proprietor">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="limited_company">Limited Company</option>
                    <option value="cooperative">Cooperative</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cacNumber">CAC Registration Number</Label>
                  <Input
                    id="cacNumber"
                    value={kycData.businessInfo.cacNumber || ""}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          cacNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., RC123456"
                  />
                  <p className="text-xs text-muted-foreground">
                    Corporate Affairs Commission registration number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxIdNumber">Tax ID Number (TIN)</Label>
                  <Input
                    id="taxIdNumber"
                    value={kycData.businessInfo.taxIdNumber || ""}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          taxIdNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter TIN"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address *</Label>
                <Textarea
                  id="businessAddress"
                  value={kycData.businessInfo.businessAddress}
                  onChange={(e) =>
                    setKycData({
                      ...kycData,
                      businessInfo: {
                        ...kycData.businessInfo,
                        businessAddress: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter full business address"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="businessCity">City *</Label>
                  <Input
                    id="businessCity"
                    value={kycData.businessInfo.businessCity}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          businessCity: e.target.value,
                        },
                      })
                    }
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessState">State *</Label>
                  <Input
                    id="businessState"
                    value={kycData.businessInfo.businessState}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          businessState: e.target.value,
                        },
                      })
                    }
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessZipCode">ZIP/Postal Code</Label>
                  <Input
                    id="businessZipCode"
                    value={kycData.businessInfo.businessZipCode}
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        businessInfo: {
                          ...kycData.businessInfo,
                          businessZipCode: e.target.value,
                        },
                      })
                    }
                    placeholder="ZIP code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bank Accounts Tab */}
      {activeTab === "bank" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Bank Accounts
                  </CardTitle>
                  <CardDescription>
                    Add bank accounts for receiving payments
                  </CardDescription>
                </div>
                <Button onClick={addBankAccount} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {kycData.bankAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No bank accounts added yet</p>
                  <p className="text-sm">
                    Add a bank account to receive payouts
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {kycData.bankAccounts.map((account) => (
                    <Card key={account.id} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {account.isPrimary && (
                              <Badge variant="default">Primary</Badge>
                            )}
                            {account.isVerified && (
                              <Badge variant="success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBankAccount(account.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Bank Name *</Label>
                            <select
                              value={account.bankName}
                              onChange={(e) =>
                                updateBankAccount(
                                  account.id,
                                  "bankName",
                                  e.target.value,
                                )
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="">Select bank</option>
                              <option value="Access Bank">Access Bank</option>
                              <option value="GTBank">GTBank</option>
                              <option value="First Bank">First Bank</option>
                              <option value="UBA">UBA</option>
                              <option value="Zenith Bank">Zenith Bank</option>
                              <option value="Kuda Bank">Kuda Bank</option>
                              <option value="Opay">Opay</option>
                              <option value="Palmpay">Palmpay</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Account Number *</Label>
                            <Input
                              value={account.accountNumber}
                              onChange={(e) =>
                                updateBankAccount(
                                  account.id,
                                  "accountNumber",
                                  e.target.value,
                                )
                              }
                              placeholder="0000000000"
                              maxLength={10}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Label>Account Name *</Label>
                          <Input
                            value={account.accountName}
                            onChange={(e) =>
                              updateBankAccount(
                                account.id,
                                "accountName",
                                e.target.value,
                              )
                            }
                            placeholder="Account holder name"
                          />
                          <p className="text-xs text-muted-foreground">
                            Must match the name on your bank account
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <input
                            type="checkbox"
                            id={`primary-${account.id}`}
                            checked={account.isPrimary}
                            onChange={(e) =>
                              updateBankAccount(
                                account.id,
                                "isPrimary",
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4"
                          />
                          <Label
                            htmlFor={`primary-${account.id}`}
                            className="text-sm font-normal"
                          >
                            Set as primary account
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Identity Verification
              </CardTitle>
              <CardDescription>
                Upload a valid government-issued ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ID Type</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="national_id">National ID Card</option>
                  <option value="passport">International Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="voters_card">Voter's Card</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ID Number</Label>
                  <Input placeholder="Enter ID number" />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Front Side</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload front side
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Back Side</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload back side
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Documents</CardTitle>
              <CardDescription>
                Upload supporting business documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: "CAC Certificate",
                  desc: "Certificate of Incorporation (if applicable)",
                },
                { type: "Tax Certificate", desc: "Tax clearance certificate" },
                { type: "Business License", desc: "Trade license or permit" },
                {
                  type: "Proof of Address",
                  desc: "Utility bill or bank statement (not older than 3 months)",
                },
              ].map((doc) => (
                <div key={doc.type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.desc}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Store Settings Tab (Original Content) */}
      {activeTab === "store" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Store Status</CardTitle>
              <CardDescription>
                Control your store visibility and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {settings.isOpen ? (
                    <Power className="h-5 w-5 text-green-600" />
                  ) : (
                    <PowerOff className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">Store Status</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.isOpen
                        ? "Currently accepting orders"
                        : "Store is closed"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={settings.isOpen ? "default" : "destructive"}
                  onClick={toggleStoreStatus}
                >
                  {settings.isOpen ? "Close Store" : "Open Store"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Vacation Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Temporarily pause all orders
                  </p>
                </div>
                <Button
                  variant={settings.isVacationMode ? "destructive" : "outline"}
                  onClick={toggleVacationMode}
                >
                  {settings.isVacationMode ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) =>
                      setSettings({ ...settings, storeName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) =>
                    setSettings({ ...settings, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phoneNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        taxRate: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) =>
                      setSettings({ ...settings, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={settings.state}
                    onChange={(e) =>
                      setSettings({ ...settings, state: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={settings.zipCode}
                    onChange={(e) =>
                      setSettings({ ...settings, zipCode: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  value={settings.deliveryRadius}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      deliveryRadius: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.operatingHours.map((hour) => (
                  <div
                    key={hour.day}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-24">
                        <p className="font-medium">{hour.day}</p>
                      </div>
                      {hour.isOpen ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hour.openTime}
                            className="w-32"
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                operatingHours: settings.operatingHours.map(
                                  (h) =>
                                    h.day === hour.day
                                      ? { ...h, openTime: e.target.value }
                                      : h,
                                ),
                              });
                            }}
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hour.closeTime}
                            className="w-32"
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                operatingHours: settings.operatingHours.map(
                                  (h) =>
                                    h.day === hour.day
                                      ? { ...h, closeTime: e.target.value }
                                      : h,
                                ),
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <Badge variant="secondary">Closed</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleDayStatus(hour.day)}
                    >
                      {hour.isOpen ? "Close" : "Open"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
