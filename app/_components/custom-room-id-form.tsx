"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export function CustomRoomIdForm() {
    const t = useTranslations("CustomRoomIdForm");
    const [isOpen, setIsOpen] = useState(false);
    const [customRoomId, setCustomRoomId] = useState("");

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-4">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground text-xs">
                    <ChevronRightIcon className={cn("transition-transform", isOpen && "rotate-90")} />
                    {t("trigger-text")}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="custom-id">{t("label")}</Label>
                    <Input id="custom-id" placeholder={t("placeholder")} value={customRoomId} onChange={(e) => setCustomRoomId(e.target.value)} />
                    <span className="text-muted-foreground text-sm md:max-w-90">{t("description")}</span>
                </div>
                <Button variant="outline" disabled={!customRoomId} asChild={!!customRoomId}>
                    <Link href={`/host?room=${customRoomId}`}>{t("button-text")}</Link>
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
