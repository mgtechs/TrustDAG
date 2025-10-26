import { Link, useLocation } from "wouter";
import { Shield, Upload, Lock, FileText, User, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { wallet, isLoading, connect, isCorrectNetwork, switchNetwork } = useWallet();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork();
      toast({
        title: "Network Switched",
        description: "Successfully switched to BDAG network",
      });
    } catch (error: any) {
      toast({
        title: "Switch Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Shield },
    { path: "/dashboard", label: "Dashboard", icon: FileText },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/access", label: "Access", icon: Lock },
    { path: "/audit", label: "Audit", icon: FileText },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-web3-cyan/20 bg-web3-navy/80 backdrop-blur-glass">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2">
              <Shield className="h-6 w-6 text-web3-cyan" />
              <span className="font-heading text-xl font-bold text-white">TrustDAG</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.slice(1).map((link) => {
              const Icon = link.icon;
              const isActive = location === link.path;
              return (
                <Link key={link.path} href={link.path} data-testid={`link-${link.label.toLowerCase()}`}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={isActive ? "bg-web3-cyan/10 text-web3-cyan" : "text-gray-300"}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!isCorrectNetwork && wallet.isConnected && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSwitchNetwork}
                data-testid="button-switch-network"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Wrong Network</span>
              </Button>
            )}
            
            {wallet.isConnected ? (
              <Badge
                variant="outline"
                className="border-web3-cyan/40 bg-web3-cyan/10 text-web3-cyan font-mono"
                data-testid="badge-wallet-address"
              >
                <Wallet className="h-3 w-3 mr-1" />
                {formatAddress(wallet.address)}
              </Badge>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-gradient-to-r from-web3-cyan to-web3-teal text-black font-heading font-semibold"
                data-testid="button-connect-wallet"
              >
                <Wallet className="h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-web3-cyan/20 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.slice(1).map((link) => {
                const Icon = link.icon;
                const isActive = location === link.path;
                return (
                  <Link key={link.path} href={link.path} data-testid={`link-mobile-${link.label.toLowerCase()}`}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${isActive ? "bg-web3-cyan/10 text-web3-cyan" : "text-gray-300"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
