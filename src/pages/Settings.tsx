import React, { useState } from 'react';
import { LocationManagement } from '@/components/settings/LocationManagement';
import { parseOpeningHours, OpeningHours } from '@/types/location';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { BusinessManagementTab } from "@/components/settings/BusinessManagementTab";
import { useLocationContext } from "@/contexts/LocationContext";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Mail, CalendarDays, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddLocationModal } from "@/components/settings/AddLocationModal";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { currentLocation, availableLocations, switchLocation } = useLocationContext();
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  
  const isSuperAdmin = user?.isGlobalAdmin;
  
  const handleAddLocation = (newLocation: any) => {
    toast.success(`New location "${newLocation.name}" created successfully!`);
    setIsAddLocationModalOpen(false);
  };

  const getOpeningHoursDisplay = (location: any) => {
    if (!location?.openingHours) return 'Not set';
    
    const hours: OpeningHours = parseOpeningHours(location.openingHours);
    
    return (
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Monday:</span> {hours.monday}</p>
        <p><span className="font-medium">Tuesday:</span> {hours.tuesday}</p>
        <p><span className="font-medium">Wednesday:</span> {hours.wednesday}</p>
        <p><span className="font-medium">Thursday:</span> {hours.thursday}</p>
        <p><span className="font-medium">Friday:</span> {hours.friday}</p>
        <p><span className="font-medium">Saturday:</span> {hours.saturday}</p>
        <p><span className="font-medium">Sunday:</span> {hours.sunday}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your POS system settings and preferences</p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger value="business">Businesses</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store details and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {currentLocation ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">{currentLocation.name}</h3>
                      <Badge variant={currentLocation.status === "active" ? "success" : "destructive"}>
                        {currentLocation.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                          <p>{currentLocation.address}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p>{currentLocation.phone || "No phone number"}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p>{currentLocation.email || "No email address"}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          Opening Hours
                        </h4>
                        
                        {getOpeningHoursDisplay(currentLocation)}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline">Edit Store Information</Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border bg-card p-10 text-center">
                    <p className="text-muted-foreground mb-4">No store selected. Please select a location.</p>
                    <Button onClick={() => setIsAddLocationModalOpen(true)}>Add Location</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account preferences and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">User Information</h3>
                    <div className="rounded-lg border p-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Name:</div>
                        <div>{user?.name || "Not set"}</div>
                        
                        <div className="text-muted-foreground">Email:</div>
                        <div>{user?.email || "Not set"}</div>
                        
                        <div className="text-muted-foreground">Role:</div>
                        <div className="capitalize">{user?.role || "Not set"}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Security Settings</h3>
                    <div className="rounded-lg border p-4">
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">Change Password</Button>
                        <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Location Management</CardTitle>
                <CardDescription>
                  Manage your business locations and branches
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddLocationModalOpen(true)}>Add Location</Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Address</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableLocations.length > 0 ? (
                      availableLocations.map((location) => (
                        <tr key={location.id} className="border-t">
                          <td className="p-3 font-medium">{location.name}</td>
                          <td className="p-3 capitalize">{location.type}</td>
                          <td className="p-3">{location.address}</td>
                          <td className="p-3">
                            <Badge variant={location.status === "active" ? "success" : "destructive"}>
                              {location.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" 
                                onClick={() => switchLocation(location.id)}>
                                Select
                              </Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No locations found. Add your first location to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Low Stock Alerts</div>
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Receive alerts when products are running low on stock
                    </p>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Sales Reports</div>
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get daily, weekly, and monthly sales reports
                    </p>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Staff Activity</div>
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Notifications about staff logins and register activity
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">System Updates</div>
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get notified about new features and system updates
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isSuperAdmin && (
          <TabsContent value="business" className="space-y-4 pt-4">
            <BusinessManagementTab />
          </TabsContent>
        )}
      </Tabs>
      
      <AddLocationModal 
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSave={handleAddLocation}
      />
    </div>
  );
};

export default Settings;
