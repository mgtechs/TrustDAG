import { useState, useRef } from "react";
import { Upload as UploadIcon, FileText, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatFileSize } from "@/lib/web3";
import { uploadFile } from "@/lib/fileOperations";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";

export default function Upload() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadedFileId, setUploadedFileId] = useState<string>("");
  const [uploadedCid, setUploadedCid] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setUploadStatus("idle");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !wallet.address) return;

    try {
      setUploadStatus("uploading");
      setErrorMessage("");

      const result = await uploadFile(
        selectedFile,
        wallet.address,
        (stage, progress) => {
          setCurrentStage(stage);
          setUploadProgress(progress);
        }
      );

      setUploadStatus("success");
      setUploadedFileId(result.fileId);
      setUploadedCid(result.cid);

      // Invalidate files query to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });

      toast({
        title: "Upload Successful",
        description: "Your file has been encrypted and stored on IPFS",
      });
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message || "Upload failed");
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadedFileId("");
    setUploadedCid("");
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            Please connect your wallet to upload files
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-web3-navy to-black p-4 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl font-bold text-white">Upload File</h1>
          <p className="text-gray-400">Encrypt and store your files on IPFS</p>
        </div>

        <GlassCard className="mb-6">
          {uploadStatus === "success" ? (
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                Upload Successful!
              </h3>
              <p className="mb-6 text-gray-400">Your file has been encrypted and stored</p>

              <div className="mb-6 space-y-4 text-left">
                <div>
                  <div className="mb-1 text-sm text-gray-500">File ID</div>
                  <code className="block rounded bg-black/30 px-3 py-2 font-mono text-sm text-web3-cyan">
                    {uploadedFileId}
                  </code>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">IPFS CID</div>
                  <code className="block rounded bg-black/30 px-3 py-2 font-mono text-sm text-web3-cyan">
                    {uploadedCid}
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading"
                  data-testid="button-upload-another"
                >
                  Upload Another
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-web3-cyan/40 text-web3-cyan"
                    data-testid="button-view-dashboard"
                  >
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* File Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-6 cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all ${
                  isDragging
                    ? "border-web3-cyan bg-web3-cyan/10"
                    : "border-web3-cyan/40 hover:border-web3-cyan/60 hover:bg-web3-cyan/5"
                }`}
                data-testid="dropzone-upload"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file"
                />
                <UploadIcon className="mx-auto mb-4 h-12 w-12 text-web3-cyan" />
                <p className="mb-2 text-lg font-semibold text-white">
                  {selectedFile ? selectedFile.name : "Drop file here or click to browse"}
                </p>
                <p className="text-sm text-gray-400">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type || "Unknown type"}`
                    : "Any file type supported"}
                </p>
              </div>

              {/* Selected File Info */}
              {selectedFile && uploadStatus === "idle" && (
                <div className="mb-6 rounded-lg bg-black/30 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-web3-cyan" />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{selectedFile.name}</div>
                      <div className="text-sm text-gray-400">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type || "Unknown"}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-web3-cyan/40 bg-web3-cyan/10 text-web3-cyan">
                      <Lock className="mr-1 h-3 w-3" />
                      AES-256
                    </Badge>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadStatus === "uploading" && (
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin text-web3-cyan" />
                      {currentStage}
                    </span>
                    <span className="text-sm font-semibold text-web3-cyan">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Error Message */}
              {uploadStatus === "error" && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/40 p-4">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadStatus !== "idle"}
                  className="flex-1 bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold disabled:opacity-50"
                  data-testid="button-start-upload"
                >
                  <Lock className="h-4 w-4" />
                  Encrypt & Upload
                </Button>
                {selectedFile && uploadStatus === "idle" && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-web3-cyan/40 text-web3-cyan"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </>
          )}
        </GlassCard>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-web3-cyan" />
            <div className="font-heading text-sm font-semibold text-white">Client-Side Encryption</div>
            <div className="text-xs text-gray-400">AES-256 GCM</div>
          </GlassCard>
          <GlassCard className="text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-web3-teal" />
            <div className="font-heading text-sm font-semibold text-white">IPFS Storage</div>
            <div className="text-xs text-gray-400">Decentralized</div>
          </GlassCard>
          <GlassCard className="text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <div className="font-heading text-sm font-semibold text-white">Blockchain Record</div>
            <div className="text-xs text-gray-400">Immutable</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
