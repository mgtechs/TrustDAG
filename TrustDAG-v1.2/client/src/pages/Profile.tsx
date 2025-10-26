import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Wallet, Mail, Bell, Save, Lock } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/web3";
import { updateUserPreferences } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { UserPreferences } from "@shared/schema";

const profileFormSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  notificationsEnabled: z.boolean().default(true),
});

export default function Profile() {
  const { wallet } = useWallet();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      notificationsEnabled: true,
    },
  });

  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/user-preferences", wallet.address],
    enabled: !!wallet.address,
    queryFn: async () => {
      const response = await fetch(`/api/user-preferences/${wallet.address}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch preferences");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        displayName: preferences.displayName || "",
        email: preferences.email || "",
        notificationsEnabled: preferences.notificationsEnabled,
      });
    }
  }, [preferences, form]);

  const saveMutation = useMutation({
    mutationFn: (values: z.infer<typeof profileFormSchema>) =>
      updateUserPreferences({
        walletAddress: wallet.address!,
        ...values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences", wallet.address] });
      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (!wallet.address) return;
    saveMutation.mutate(values);
  };

  if (!wallet.isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <GlassCard className="max-w-md text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-web3-cyan" />
          <h2 className="mb-2 font-heading text-2xl font-bold text-white">
            Wallet Not Connected
          </h2>
          <p className="mb-4 text-gray-400">
            Please connect your wallet to view your profile
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-web3-navy to-black p-4 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl font-bold text-white">Profile</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Wallet Info Card */}
          <GlassCard className="lg:col-span-1">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-web3-cyan to-web3-teal p-1">
                <div className="rounded-full bg-web3-navy p-6">
                  <User className="h-12 w-12 text-web3-cyan" />
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div>
                <div className="mb-1 text-sm text-gray-500">Wallet Address</div>
                <code className="font-mono text-sm text-web3-cyan">
                  {formatAddress(wallet.address)}
                </code>
              </div>

              <div>
                <div className="mb-1 text-sm text-gray-500">Network</div>
                <Badge variant="outline" className="border-web3-teal/40 bg-web3-teal/10 text-web3-teal">
                  BDAG Network
                </Badge>
              </div>

              <div>
                <div className="mb-1 text-sm text-gray-500">Chain ID</div>
                <code className="font-mono text-sm text-gray-400">
                  {wallet.chainId}
                </code>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-black/30 p-3">
                <span className="text-sm text-gray-400">Status</span>
                <Badge variant="outline" className="border-green-500/40 bg-green-500/10 text-green-500">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-black/30 p-3">
                <span className="text-sm text-gray-400">Role</span>
                <Badge variant="outline" className="border-web3-cyan/40 bg-web3-cyan/10 text-web3-cyan">
                  Owner
                </Badge>
              </div>
            </div>
          </GlassCard>

          {/* Profile Settings */}
          <GlassCard className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-web3-cyan/10 p-2">
                <User className="h-5 w-5 text-web3-cyan" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-white">Profile Settings</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Display Name */}
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Display Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your name"
                          className="border-web3-cyan/40 bg-black/30 text-white placeholder:text-gray-500"
                          data-testid="input-display-name"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Optional - used for display purposes only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="border-web3-cyan/40 bg-black/30 pl-10 text-white placeholder:text-gray-500"
                            data-testid="input-email"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        For notifications and recovery purposes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notifications */}
                <FormField
                  control={form.control}
                  name="notificationsEnabled"
                  render={({ field }) => (
                    <FormItem>
                      <div className="rounded-lg bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-web3-cyan" />
                            <div>
                              <FormLabel className="font-semibold text-white">
                                Enable Notifications
                              </FormLabel>
                              <FormDescription className="text-gray-500">
                                Receive alerts for file access and grants
                              </FormDescription>
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-notifications"
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Save Button */}
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="w-full bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold"
                  data-testid="button-save-profile"
                >
                  <Save className="h-4 w-4" />
                  {saveMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </GlassCard>
        </div>

        {/* Security Info */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <GlassCard>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-web3-cyan" />
              <div>
                <div className="mb-1 font-heading text-sm font-semibold text-white">
                  Private Key Security
                </div>
                <p className="text-xs text-gray-400">
                  Your private keys never leave your wallet. TrustDAG only stores encrypted file metadata.
                </p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-web3-teal" />
              <div>
                <div className="mb-1 font-heading text-sm font-semibold text-white">
                  Wallet Connection
                </div>
                <p className="text-xs text-gray-400">
                  Your wallet is securely connected via MetaMask. Disconnect anytime from your wallet.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
