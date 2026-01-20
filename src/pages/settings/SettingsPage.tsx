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
import type { StoreSettings } from "../../types";
import { Store, Clock, MapPin, Save, Power, PowerOff } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await mockApi.getStoreSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
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

  if (loading || !settings) {
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
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground">
            Manage your store information and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Store Status */}
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

      {/* Basic Information */}
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

      {/* Location */}
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

      {/* Operating Hours */}
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
                            operatingHours: settings.operatingHours.map((h) =>
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
                            operatingHours: settings.operatingHours.map((h) =>
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
    </div>
  );
}
