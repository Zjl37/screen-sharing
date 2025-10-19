import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Monitor, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CustomRoomIdForm } from "./_components/custom-room-id-form";

export default function Home() {
    const t = useTranslations("Home");
    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t("header")}</h1>
                <p className="text-primary text-xl">{t("description")}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor />
                            {t("start-title")}
                        </CardTitle>
                        <CardDescription>{t("start-desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/host">
                            <Button className="w-full">{t("create-room-btn")}</Button>
                        </Link>
                        <CustomRoomIdForm />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
                            {t("join-title")}
                        </CardTitle>
                        <CardDescription>{t("join-desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/join">
                            <Button variant="outline" className="w-full">
                                {t("join-room-btn")}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
            <Alert>
                <AlertCircle />
                <AlertTitle>{t("note-title")}</AlertTitle>
                <AlertDescription>{t("note-description")}</AlertDescription>
            </Alert>
        </div>
    );
}
