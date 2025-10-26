import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Lock, Unlock, Upload as UploadIcon, Download, Clock, Filter } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/web3";
import type { AuditEvent, EventType } from "@shared/schema";

const eventConfig: Record<EventType, { icon: any; color: string; label: string }> = {
  upload: { icon: UploadIcon, color: "text-web3-cyan", label: "Upload" },
  download: { icon: Download, color: "text-blue-400", label: "Download" },
  grant: { icon: Unlock, color: "text-green-500", label: "Grant" },
  revoke: { icon: Lock, color: "text-red-400", label: "Revoke" },
  access: { icon: FileText, color: "text-purple-400", label: "Access" },
};

export default function Audit() {
  const { wallet } = useWallet();
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  const { data: events = [], isLoading } = useQuery<AuditEvent[]>({
    queryKey: ["/api/audit-events", wallet.address],
    enabled: !!wallet.address,
    queryFn: async () => {
      const response = await fetch(`/api/audit-events?address=${wallet.address}`);
      if (!response.ok) throw new Error("Failed to fetch audit events");
      return response.json();
    },
  });

  const filteredEvents = filterType === "all"
    ? events
    : events.filter((e) => e.eventType === filterType);

  const eventTypes: Array<{ value: EventType | "all"; label: string }> = [
    { value: "all", label: "All Events" },
    { value: "upload", label: "Uploads" },
    { value: "download", label: "Downloads" },
    { value: "grant", label: "Grants" },
    { value: "revoke", label: "Revokes" },
    { value: "access", label: "Access" },
  ];

  if (!wallet.isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <GlassCard className="max-w-md text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-web3-cyan" />
          <h2 className="mb-2 font-heading text-2xl font-bold text-white">
            Wallet Not Connected
          </h2>
          <p className="mb-4 text-gray-400">
            Please connect your wallet to view audit trail
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-web3-navy to-black p-4 pt-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl font-bold text-white">Audit Trail</h1>
          <p className="text-gray-400">Complete history of all file and access operations</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>
          {eventTypes.map((type) => (
            <Button
              key={type.value}
              variant={filterType === type.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType(type.value)}
              className={filterType === type.value ? "bg-web3-cyan/10 text-web3-cyan" : "text-gray-400"}
              data-testid={`filter-${type.value}`}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {Object.entries(eventConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = events.filter((e) => e.eventType === type).length;
            return (
              <GlassCard key={type}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full bg-black/30 p-2 ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{count}</div>
                    <div className="text-xs text-gray-400">{config.label}s</div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Timeline */}
        <GlassCard>
          <div className="mb-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-web3-cyan" />
            <h2 className="font-heading text-xl font-semibold text-white">Event Timeline</h2>
            <Badge variant="outline" className="border-web3-cyan/40 bg-web3-cyan/10 text-web3-cyan">
              {filteredEvents.length} events
            </Badge>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-black/30" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-web3-cyan/50" />
              <p className="text-gray-400">
                {filterType === "all" ? "No events yet" : `No ${filterType} events`}
              </p>
            </div>
          ) : (
            <div className="relative space-y-4" data-testid="audit-timeline">
              {/* Timeline Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-web3-cyan/20" />

              {filteredEvents.map((event, index) => {
                const config = eventConfig[event.eventType as EventType];
                const Icon = config.icon;

                return (
                  <div
                    key={event.id}
                    className="relative flex gap-4"
                    data-testid={`event-${event.id}`}
                  >
                    {/* Timeline Icon */}
                    <div className={`relative z-10 rounded-full bg-web3-navy p-2 ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 rounded-lg bg-black/30 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`border-current ${config.color} text-xs`}
                        >
                          {config.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Actor:</span>
                          <code className="font-mono text-web3-cyan">
                            {formatAddress(event.actorAddress)}
                          </code>
                        </div>

                        {event.fileName && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">File:</span>
                            <span className="text-white">{event.fileName}</span>
                          </div>
                        )}

                        {event.fileId && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">File ID:</span>
                            <code className="font-mono text-xs text-gray-400">
                              {event.fileId}
                            </code>
                          </div>
                        )}

                        {event.targetAddress && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Target:</span>
                            <code className="font-mono text-web3-teal">
                              {formatAddress(event.targetAddress)}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
