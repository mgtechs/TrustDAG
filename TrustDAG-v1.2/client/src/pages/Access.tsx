import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Unlock, UserPlus, Trash2, AlertCircle, CheckCircle, Search } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/web3";
import { grantFileAccess, revokeFileAccess } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { File, AccessGrant } from "@shared/schema";
import { useLocation } from "wouter";

const accessGrantFormSchema = z.object({
  fileId: z.string().min(1, "Please select a file"),
  grantAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  role: z.enum(["viewer", "editor"]),
});

export default function Access() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const preselectedFileId = searchParams.get('fileId');

  const form = useForm<z.infer<typeof accessGrantFormSchema>>({
    resolver: zodResolver(accessGrantFormSchema),
    defaultValues: {
      fileId: preselectedFileId || "",
      grantAddress: "",
      role: "viewer",
    },
  });

  const selectedFileId = form.watch("fileId");

  const { data: files = [] } = useQuery<File[]>({
    queryKey: ["/api/files", wallet.address],
    enabled: !!wallet.address,
    queryFn: async () => {
      const response = await fetch(`/api/files?owner=${wallet.address}`);
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    },
  });

  const { data: grants = [] } = useQuery<AccessGrant[]>({
    queryKey: ["/api/access-grants", selectedFileId],
    enabled: !!selectedFileId,
    queryFn: async () => {
      const response = await fetch(`/api/access-grants?fileId=${selectedFileId}`);
      if (!response.ok) throw new Error("Failed to fetch grants");
      return response.json();
    },
  });

  const grantMutation = useMutation({
    mutationFn: (values: z.infer<typeof accessGrantFormSchema>) =>
      grantFileAccess(values.fileId, values.grantAddress, wallet.address!, values.role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-grants", variables.fileId] });
      form.reset({ fileId: variables.fileId, grantAddress: "", role: "viewer" });
      toast({
        title: "Access Granted",
        description: `Successfully granted ${variables.role} access`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Grant Access",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (grantId: string) => revokeFileAccess(grantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-grants", selectedFileId] });
      toast({
        title: "Access Revoked",
        description: "Successfully revoked access",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Revoke Access",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof accessGrantFormSchema>) => {
    if (!wallet.address) return;
    grantMutation.mutate(values);
  };

  const handleRevokeAccess = async (grantId: string) => {
    revokeMutation.mutate(grantId);
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
            Please connect your wallet to manage access
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-web3-navy to-black p-4 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl font-bold text-white">Access Control</h1>
          <p className="text-gray-400">Grant and revoke file access permissions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grant Access Panel */}
          <GlassCard>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-web3-cyan/10 p-2">
                <UserPlus className="h-5 w-5 text-web3-cyan" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-white">Grant Access</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Select File</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className="border-web3-cyan/40 bg-black/30 text-white"
                            data-testid="select-file"
                          >
                            <SelectValue placeholder="Choose a file" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-web3-cyan/40 bg-web3-navy text-white">
                          {files.map((file) => (
                            <SelectItem key={file.id} value={file.fileId}>
                              {file.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grantAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="0x..."
                          className="border-web3-cyan/40 bg-black/30 text-white placeholder:text-gray-500"
                          data-testid="input-grant-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Permission Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className="border-web3-cyan/40 bg-black/30 text-white"
                            data-testid="select-role"
                          >
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-web3-cyan/40 bg-web3-navy text-white">
                          <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                          <SelectItem value="editor">Editor (Read & Write)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={grantMutation.isPending}
                  className="w-full bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold disabled:opacity-50"
                  data-testid="button-grant-access"
                >
                  <Lock className="h-4 w-4" />
                  {grantMutation.isPending ? "Granting..." : "Grant Access"}
                </Button>

                <div className="rounded-lg bg-web3-cyan/5 border border-web3-cyan/20 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-web3-cyan mt-0.5" />
                    <p className="text-xs text-gray-400">
                      Granting access creates a blockchain transaction and logs the event to the audit trail
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </GlassCard>

          {/* Access List Panel */}
          <GlassCard>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-web3-teal/10 p-2">
                <Unlock className="h-5 w-5 text-web3-teal" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-white">Granted Access</h2>
            </div>

            {!selectedFileId ? (
              <div className="py-12 text-center">
                <Search className="mx-auto mb-3 h-12 w-12 text-web3-cyan/50" />
                <p className="text-gray-400">Select a file to view access grants</p>
              </div>
            ) : grants.length === 0 ? (
              <div className="py-12 text-center">
                <Lock className="mx-auto mb-3 h-12 w-12 text-web3-cyan/50" />
                <p className="text-gray-400">No access grants for this file</p>
              </div>
            ) : (
              <div className="space-y-3">
                {grants.map((grant) => (
                  <div
                    key={grant.id}
                    className="flex items-center justify-between rounded-lg bg-black/30 p-4"
                    data-testid={`grant-item-${grant.id}`}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <code className="font-mono text-sm text-white">
                          {formatAddress(grant.grantedTo)}
                        </code>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            grant.role === "editor"
                              ? "border-web3-teal/40 bg-web3-teal/10 text-web3-teal"
                              : "border-web3-cyan/40 bg-web3-cyan/10 text-web3-cyan"
                          }`}
                        >
                          {grant.role}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Granted {new Date(grant.grantedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeAccess(grant.id)}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      data-testid={`button-revoke-${grant.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Info Section */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="mb-1 font-heading text-sm font-semibold text-white">
                  Viewer Role
                </div>
                <p className="text-xs text-gray-400">
                  Can download and decrypt files, but cannot modify access permissions
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-web3-teal" />
              <div>
                <div className="mb-1 font-heading text-sm font-semibold text-white">
                  Editor Role
                </div>
                <p className="text-xs text-gray-400">
                  Can download, decrypt, and grant access to other users (but not revoke)
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
