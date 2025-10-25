"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WebSocketClient } from "@/components/WebSocketProvider";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function AccountPage() {
  const router = useRouter();

  // State for user data
  const [userData, setUserData] = useState<ProfileFormValues>({
    username: "",
    email: "",
    name: "",
  });
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [userDataError, setUserDataError] = useState("");

  // State for form submission
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State for account deactivation/deletion
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deactivateSuccess, setDeactivateSuccess] = useState(false);
  const [deactivateError, setDeactivateError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  // Initialize forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userData,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Check authentication
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [router]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUserData(true);
      setUserDataError("");

      try {
        // Check for stored user data in localStorage
        const storedUserData = localStorage.getItem("userData");

        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);

          // Ensure all required fields exist
          const validUserData = {
            name: parsedUserData.name || "John Doe",
            username: parsedUserData.username || "johndoe",
            email: parsedUserData.email || "john.doe@example.com",
          };

          setUserData(validUserData);
          profileForm.reset(validUserData);
        } else {
          // If no stored data, use default values
          const defaultUserData = {
            name: "John Doe",
            username: "johndoe",
            email: "john.doe@example.com",
          };

          setUserData(defaultUserData);
          profileForm.reset(defaultUserData);

          // Store default data
          localStorage.setItem("userData", JSON.stringify(defaultUserData));
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserDataError("Failed to load user data. Please refresh the page.");
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [profileForm]);

  // Add a state for the avatar image
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // Add this function after the other useEffect hooks
  useEffect(() => {
    // Load avatar from localStorage if it exists
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) {
      setAvatarSrc(storedAvatar);
    }
  }, []);

  // Add this function before the onProfileSubmit function
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Set the avatar in state
          setAvatarSrc(result);

          // Save to localStorage
          localStorage.setItem("userAvatar", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form submission
  async function onProfileSubmit(data: ProfileFormValues) {
    setIsProfileUpdating(true);
    setProfileError("");
    setProfileSuccess(false);

    try {
      // In a real app, this would be an API call to your backend
      console.log("Profile update data:", data);

      // Update localStorage with new data
      localStorage.setItem("userData", JSON.stringify(data));

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state with new data
      setUserData(data);
      setProfileSuccess(true);

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileError("Failed to update profile. Please try again.");
    } finally {
      setIsProfileUpdating(false);
    }
  }

  // Handle password form submission
  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsPasswordUpdating(true);
    setPasswordError("");
    setPasswordSuccess(false);

    try {
      // This would be an API call to your backend
      console.log("Password update data:", data);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPasswordSuccess(true);
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsPasswordUpdating(false);
    }
  }

  // Handle account deactivation
  async function handleDeactivateAccount() {
    setIsDeactivating(true);
    setDeactivateError("");
    setDeactivateSuccess(false);
    setDeactivateDialogOpen(false);

    try {
      // This would be an API call to your backend
      console.log("Deactivating account");

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear auth token
      localStorage.removeItem("authToken");

      setDeactivateSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Account deactivation error:", error);
      setDeactivateError("Failed to deactivate account. Please try again.");
    } finally {
      setIsDeactivating(false);
    }
  }

  // Handle account deletion
  async function handleDeleteAccount() {
    setIsDeleting(true);
    setDeactivateError("");
    setDeleteDialogOpen(false);

    try {
      // This would be an API call to your backend
      console.log("Deleting account permanently");

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear all user data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Account deletion error:", error);
      setDeactivateError("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <WebSocketClient
      serverUrl={process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000"}
    >
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Account</h1>
        </div>

        {isLoadingUserData ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userDataError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{userDataError}</AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="deactivate">Deactivate</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileSuccess && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        Your profile has been updated successfully.
                      </AlertDescription>
                    </Alert>
                  )}

                  {profileError && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={avatarSrc || "/placeholder.svg?height=96&width=96"}
                        alt={userData.name || "User"}
                      />
                      <AvatarFallback className="text-2xl">
                        {userData.name
                          ? userData.name.substring(0, 2).toUpperCase()
                          : "JD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document.getElementById("avatar-upload")?.click()
                          }
                        >
                          Change Avatar
                        </Button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      {avatarSrc && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground mt-1"
                          onClick={() => {
                            setAvatarSrc(null);
                            localStorage.removeItem("userAvatar");
                          }}
                        >
                          Remove Avatar
                        </Button>
                      )}
                    </div>
                  </div>

                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your full name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public username.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the email associated with your account.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isProfileUpdating}>
                        {isProfileUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update profile"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {passwordSuccess && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        Your password has been updated successfully.
                      </AlertDescription>
                    </Alert>
                  )}

                  {passwordError && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Password must be at least 8 characters and include
                              uppercase, lowercase, number, and special
                              character.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isPasswordUpdating}>
                        {isPasswordUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update password"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deactivate">
              <Card>
                <CardHeader>
                  <CardTitle>Deactivate Account</CardTitle>
                  <CardDescription>
                    Temporarily deactivate or permanently delete your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {deactivateSuccess && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        Your account has been deactivated. Redirecting...
                      </AlertDescription>
                    </Alert>
                  )}

                  {deactivateError && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{deactivateError}</AlertDescription>
                    </Alert>
                  )}

                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Deactivating your account will temporarily disable your
                      access. Deleting your account is permanent and cannot be
                      undone.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Temporary Deactivation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your account will be disabled and hidden from other
                        users until you log in again.
                      </p>

                      <Dialog
                        open={deactivateDialogOpen}
                        onOpenChange={setDeactivateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mt-2">
                            Deactivate Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Deactivate Account</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to deactivate your account?
                              You can reactivate it by logging in again.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeactivateDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeactivateAccount}
                              disabled={isDeactivating}
                            >
                              {isDeactivating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deactivating...
                                </>
                              ) : (
                                "Deactivate"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Permanent Deletion
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All your data will be permanently deleted. This action
                        cannot be undone.
                      </p>

                      <Dialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="mt-2">
                            Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Delete Account Permanently
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. All your data will
                              be permanently deleted. Are you absolutely sure
                              you want to delete your account?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm font-medium">
                              Type "DELETE" to confirm:
                            </p>
                            <Input
                              className="mt-2"
                              placeholder="DELETE"
                              onChange={(e) => {
                                const confirmButton = document.getElementById(
                                  "confirm-delete-button"
                                ) as HTMLButtonElement;
                                if (confirmButton) {
                                  confirmButton.disabled =
                                    e.target.value !== "DELETE";
                                }
                              }}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              id="confirm-delete-button"
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={true}
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete Permanently"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </WebSocketClient>
  );
}
