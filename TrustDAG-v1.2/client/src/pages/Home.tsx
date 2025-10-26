import { Link } from "wouter";
import { Shield, Lock, Globe, Key, Upload, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useWallet } from "@/hooks/useWallet";
import heroImage from "@assets/generated_images/Blockchain_network_hero_image_4e1cd814.png";

export default function Home() {
  const { wallet, connect, isLoading } = useWallet();

  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "Client-side AES-256 encryption ensures your files remain private and secure",
    },
    {
      icon: Globe,
      title: "Decentralized Storage",
      description: "Files stored on IPFS with blockchain-based access control for maximum reliability",
    },
    {
      icon: Key,
      title: "Granular Access Control",
      description: "Grant or revoke file access permissions with blockchain transparency",
    },
    {
      icon: FileCheck,
      title: "Immutable Audit Trail",
      description: "Every action is logged on-chain for complete transparency and accountability",
    },
  ];

  const stats = [
    { value: "AES-256", label: "Encryption" },
    { value: "IPFS", label: "Storage" },
    { value: "Blockchain", label: "Access Control" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        {/* Hero Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Blockchain Network"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-web3-navy/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-web3-cyan/30 bg-web3-cyan/10 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-web3-cyan" />
            <span className="text-sm font-medium text-web3-cyan">Powered by Blockchain & IPFS</span>
          </div>

          <h1 className="mb-6 font-heading text-5xl font-bold text-white md:text-7xl">
            Decentralized File Storage
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Store files securely with blockchain-based access control, IPFS storage, and
            client-side encryption. Your data, your control.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {wallet.isConnected ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold text-lg px-8 py-6"
                  data-testid="button-go-to-dashboard"
                >
                  <FileCheck className="h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={connect}
                disabled={isLoading}
                className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold text-lg px-8 py-6"
                data-testid="button-hero-connect"
              >
                <Shield className="h-5 w-5" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="border-web3-cyan/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 font-heading text-lg px-8 py-6"
              data-testid="button-learn-more"
              asChild
            >
              <a href="#features">
                <Globe className="h-5 w-5" />
                Learn More
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold text-web3-cyan">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-b from-web3-navy to-black py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-4xl font-bold text-white">
              Why TrustDAG?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Enterprise-grade security meets decentralized infrastructure
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={feature.title} hover className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-web3-cyan/10 p-4">
                      <Icon className="h-8 w-8 text-web3-cyan" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-black to-web3-navy py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <GlassCard className="p-12">
            <h2 className="mb-4 font-heading text-3xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-gray-300">
              Connect your wallet and start storing files securely on the decentralized web
            </p>
            {!wallet.isConnected && (
              <Button
                size="lg"
                onClick={connect}
                disabled={isLoading}
                className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold text-lg px-8"
                data-testid="button-cta-connect"
              >
                <Upload className="h-5 w-5" />
                Connect Wallet to Upload
              </Button>
            )}
            {wallet.isConnected && (
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold text-lg px-8"
                  data-testid="button-cta-upload"
                >
                  <Upload className="h-5 w-5" />
                  Upload Your First File
                </Button>
              </Link>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
