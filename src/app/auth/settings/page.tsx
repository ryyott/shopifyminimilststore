"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Bell, Store, Package, Eye, User } from "lucide-react"

export default function SettingsPage() {
  // Store Settings State
  const [storeName, setStoreName] = useState("YZY Store")
  const [storeEmail, setStoreEmail] = useState("admin@yzystore.com")
  const [currency, setCurrency] = useState("USD")
  const [timezone, setTimezone] = useState("America/New_York")

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderNotifications, setOrderNotifications] = useState(true)
  const [customerNotifications, setCustomerNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(true)

  // Inventory Settings State
  const [lowStockAlert, setLowStockAlert] = useState(true)
  const [lowStockThreshold, setLowStockThreshold] = useState("5")
  const [outOfStockAlert, setOutOfStockAlert] = useState(true)
  const [autoRestockAlert, setAutoRestockAlert] = useState(false)

  // Display Settings State
  const [itemsPerPage, setItemsPerPage] = useState("20")
  const [defaultView, setDefaultView] = useState("grid")
  const [showOutOfStock, setShowOutOfStock] = useState(true)

  const handleSaveStoreSettings = () => {
    toast.success("Store settings saved", {
      description: "Your store settings have been updated successfully.",
    })
  }

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved", {
      description: "Your notification preferences have been updated.",
    })
  }

  const handleSaveInventory = () => {
    toast.success("Inventory settings saved", {
      description: "Your inventory alert settings have been updated.",
    })
  }

  const handleSaveDisplay = () => {
    toast.success("Display settings saved", {
      description: "Your display preferences have been updated.",
    })
  }

  const handleSaveAccount = () => {
    toast.success("Account settings saved", {
      description: "Your account settings have been updated.",
    })
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your store preferences and configuration
          </p>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Display</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Your store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-email">Store Email</Label>
                <Input
                  id="store-email"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  placeholder="store@example.com"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <Button onClick={handleSaveStoreSettings}>
                Save Store Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-notifications">New Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <Switch
                  id="order-notifications"
                  checked={orderNotifications}
                  onCheckedChange={setOrderNotifications}
                  disabled={!emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="customer-notifications">New Customer Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new customers sign up
                  </p>
                </div>
                <Switch
                  id="customer-notifications"
                  checked={customerNotifications}
                  onCheckedChange={setCustomerNotifications}
                  disabled={!emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive tips and product updates
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                  disabled={!emailNotifications}
                />
              </div>

              <Separator />

              <Button onClick={handleSaveNotifications}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>
                Configure alerts for inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-stock-alert">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch
                  id="low-stock-alert"
                  checked={lowStockAlert}
                  onCheckedChange={setLowStockAlert}
                />
              </div>

              {lowStockAlert && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="low-stock-threshold"
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      min="1"
                      max="100"
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">units or less</span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="out-of-stock-alert">Out of Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are out of stock
                  </p>
                </div>
                <Switch
                  id="out-of-stock-alert"
                  checked={outOfStockAlert}
                  onCheckedChange={setOutOfStockAlert}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-restock-alert">Auto-Restock Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders to restock popular items
                  </p>
                </div>
                <Switch
                  id="auto-restock-alert"
                  checked={autoRestockAlert}
                  onCheckedChange={setAutoRestockAlert}
                />
              </div>

              <Separator />

              <Button onClick={handleSaveInventory}>
                Save Inventory Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how information is displayed in your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="items-per-page">Items Per Page</Label>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger id="items-per-page" className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-view">Default Product View</Label>
                <Select value={defaultView} onValueChange={setDefaultView}>
                  <SelectTrigger id="default-view" className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="compact">Compact View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-out-of-stock">Show Out of Stock Products</Label>
                  <p className="text-sm text-muted-foreground">
                    Display products that are currently out of stock
                  </p>
                </div>
                <Switch
                  id="show-out-of-stock"
                  checked={showOutOfStock}
                  onCheckedChange={setShowOutOfStock}
                />
              </div>

              <Separator />

              <Button onClick={handleSaveDisplay}>
                Save Display Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input
                  id="admin-name"
                  defaultValue="Admin User"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@yzystore.com"
                  placeholder="admin@example.com"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>

              <Separator />

              <Button onClick={handleSaveAccount}>
                Save Account Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
