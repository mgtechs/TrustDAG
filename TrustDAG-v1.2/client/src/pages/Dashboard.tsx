import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Lock, Unlock, Copy, Clock, User, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatFileSize, formatCID, copyToClipboard } from "@/lib/web3";
import { downloadFile, triggerDownload } from "@/lib/fileOperations";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { File } from "@shared/schema";

export default function Dashboard() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  const { data: files = [], isLoading } = useQuery<File[]>({
    queryKey: ["/api/files", wallet.address],
    enabled: !!wallet.address,
    queryFn: async () => {
      const response = await fetch(`/api/files?owner=${wallet.address}`);
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    },
  });

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      });
    }
  };

  const handleDownload = async (file: File) => {
    if (!wallet.address) return;

    try {
      setDownloadingFileId(file.id);
      
      const blob = await downloadFile(
        {
          name: file.name,
          ipfsCid: file.ipfsCid,
          encryptionKey: file.encryptionKey,
          iv: file.iv,
          mimeType: file.mimeType,
        },
        file.fileId,
        wallet.address
      );

      triggerDownload(blob, file.name);

      toast({
        title: "Download Complete",
        description: `${file.name} has been decrypted and downloaded`,
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDownloadingFileId(null);
    }
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
            Please connect your wallet to view your files
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-web3-navy to-black p-4 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 font-heading text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Manage your encrypted files</p>
          </div>
          <Link href="/upload">
            <Button
              className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold"
              data-testid="button-upload-new"
            >
              <FileText className="h-4 w-4" />
              Upload New File
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-web3-cyan/10 p-3">
                <FileText className="h-6 w-6 text-web3-cyan" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{files.length}</div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-web3-teal/10 p-3">
                <Lock className="h-6 w-6 text-web3-teal" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">AES-256</div>
                <div className="text-sm text-gray-400">Encryption</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-web3-cyan/10 p-3">
                <User className="h-6 w-6 text-web3-cyan" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">IPFS</div>
                <div className="text-sm text-gray-400">Storage</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="h-64 animate-pulse" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <GlassCard className="py-16 text-center">
            <Unlock className="mx-auto mb-4 h-16 w-16 text-web3-cyan/50" />
            <h3 className="mb-2 font-heading text-xl font-semibold text-white">
              No Files Yet
            </h3>
            <p className="mb-4 text-gray-400">
              Upload your first encrypted file to get started
            </p>
            <Link href="/upload">
              <Button
                className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading"
                data-testid="button-upload-first"
              >
                Upload File
              </Button>
            </Link>
          </GlassCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="files-grid">
            {files.map((file) => (
              <GlassCard key={file.id} hover className="flex flex-col" data-testid={`file-card-${file.id}`}>
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-web3-cyan" />
                    <Badge variant="outline" className="border-web3-teal/40 bg-web3-teal/10 text-web3-teal text-xs">
                      {file.mimeType.split('/')[0]}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-web3-cyan/40 bg-web3-cyan/10 text-web3-cyan text-xs">
                    <Lock className="h-3 w-3" />
                  </Badge>
                </div>

                {/* File Info */}
                <div className="mb-4 flex-1">
                  <h3 className="mb-2 truncate font-semibold text-white" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* CID */}
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">IPFS CID</div>
                    <div className="flex items-center gap-1">
                      <code className="flex-1 truncate rounded bg-black/30 px-2 py-1 font-mono text-xs text-web3-cyan">
                        {formatCID(file.ipfsCid)}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleCopy(file.ipfsCid, "CID")}
                        data-testid={`button-copy-cid-${file.id}`}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* File ID */}
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">File ID</div>
                    <code className="block truncate rounded bg-black/30 px-2 py-1 font-mono text-xs text-gray-400">
                      {file.fileId}
                    </code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-web3-cyan/40 text-web3-cyan"
                    onClick={() => handleDownload(file)}
                    disabled={downloadingFileId === file.id}
                    data-testid={`button-download-${file.id}`}
                  >
                    {downloadingFileId === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download
                  </Button>
                  <Link href={`/access?fileId=${file.fileId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-web3-teal/40 text-web3-teal"
                      data-testid={`button-manage-access-${file.id}`}
                    >
                      <Lock className="h-4 w-4" />
                      Access
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
