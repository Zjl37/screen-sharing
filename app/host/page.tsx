"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShareOptions } from "./_components/share-options";

export default function HostPage() {
    const [roomId, setRoomId] = useState("");
    const [peer, setPeer] = useState<Peer | null>(null);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const [connections, setConnections] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        try {
            const newPeer = new Peer({ debug: 2 });
            setPeer(newPeer);

            newPeer.on("open", (id) => {
                setRoomId(id);
            });

            newPeer.on("connection", (connection) => {
                setConnections((prev) => [...prev, connection.peer]);

                connection.on("close", () => {
                    setConnections((prev) => prev.filter((peerId) => peerId !== connection.peer));
                });
            });

            return () => {
                newPeer.destroy();
            };
        } catch (error) {
            console.error("Error initializing peer:", error);
        }
    }, []);

    useEffect(() => {
        if (!peer) return;

        if (!activeStream) {
            if (connections.length > 0) {
                toast.info("New viewer connected", {
                    description: "Click to start sharing your screen.",
                    duration: Infinity,
                    action: {
                        label: "Start Sharing",
                        onClick: async () => {
                            try {
                                const stream = await navigator.mediaDevices.getDisplayMedia({
                                    video: true,
                                    audio: true
                                });
                                setActiveStream(stream);
                            } catch (err) {
                                console.error("Screen sharing error:", err);
                                toast.error("Screen sharing error", {
                                    description: "Failed to start screen sharing. Please try again."
                                });
                            }
                        }
                    }
                });
            }
        } else {
            connections.forEach((connection) => {
                const call = peer.call(connection, activeStream);

                activeStream.getTracks()[0].onended = () => {
                    call.close();
                    activeStream.getTracks().forEach((track) => track.stop());
                };
            });
        }
    }, [peer, toast, activeStream, connections]);

    function endSession() {
        if (activeStream) {
            activeStream.getTracks().forEach((track) => track.stop());
            setActiveStream(null);
        }

        if (peer) {
            peer.destroy();
            setPeer(null);
        }

        setConnections([]);
        setRoomId("");

        toast.info("Session ended", {
            description: "Your screen sharing session has been terminated."
        });

        router.push("/");
    }

    return (
        <div className="px-4 py-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
                <Button variant="outline" asChild>
                    <Link href="/" className="flex items-center self-start">
                        <ArrowLeft />
                        Back to Home
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor />
                            Your Screen Sharing Room
                        </CardTitle>
                        <CardDescription>Share your room code or link with others to let them view your screen. To share audio as well, ensure you're using Chrome or Edge, and select the option to share a tab.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <ShareOptions roomId={roomId} />

                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Users className="size-4" />
                                <span className="text-sm">Current Viewers</span>
                            </div>
                            <span className="text-lg font-semibold">{connections.length}</span>
                        </div>

                        {activeStream && (
                            <Button variant="destructive" onClick={endSession} className="self-end">
                                Stop sharing
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
