"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function JoinPage() {
    const tc = useTranslations("Common");
    const t = useTranslations("JoinPage");
    const [roomId, setRoomId] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomFromUrl = params.get("room");
        if (roomFromUrl) {
            setRoomId(roomFromUrl);
        }

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && activeStream) {
            videoRef.current.srcObject = activeStream;
            videoRef.current.play().catch(console.error);
        }
    }, [activeStream]);

    function joinRoom(roomIdToJoin: string = roomId) {
        if (!roomIdToJoin.trim()) {
            toast.error(t("code-required"), {
                description: t("code-required-desc")
            });
            return;
        }

        setIsConnecting(true);

        const peer = new Peer({ debug: 2 });
        peerRef.current = peer;

        peer.on("open", () => {
            const connection = peer.connect(roomIdToJoin);

            connection.on("open", () => {
                toast.success(t("connected"), {
                    description: t("connected-desc")
                });
            });

            peer.on("call", (call) => {
                call.answer();
                call.on("stream", (remoteStream) => {
                    setActiveStream(remoteStream);
                });
            });

            connection.on("close", () => {
                setIsConnecting(false);
                setRoomId("");
                setActiveStream(null);
                toast.error(t("disconnected"), {
                    description: t("disconnected-desc")
                });
            });
        });

        peer.on("error", (err) => {
            console.error("Peer error:", err);
            setIsConnecting(false);
            toast.error(t("connection-failed"), {
                description: t("connection-failed-desc")
            });
        });
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
            <Button variant="outline" asChild>
                <Link href="/" className="flex items-center self-start">
                    <ArrowLeft />
                    {tc("back-to-home")}
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users />
                        {t("title")}
                    </CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    {!activeStream ? (
                        <div className="flex flex-col gap-4">
                            <Input placeholder={t("enter-code")} value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={isConnecting} />
                            <Button className="w-full" onClick={() => joinRoom()} disabled={isConnecting || !roomId.trim()}>
                                {isConnecting ? t("connecting") : t("join-room")}
                            </Button>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-lg">
                            <video ref={videoRef} className="h-full w-full object-contain" autoPlay playsInline loop controls muted />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
