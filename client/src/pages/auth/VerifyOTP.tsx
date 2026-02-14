import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCookie } from "@/lib/csrf"
import { Loader2, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VerifyOTP() {
    const [isLoading, setIsLoading] = useState(false)
    const [csrfToken, setCsrfToken] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const token = getCookie("csrftoken")
        if (token) setCsrfToken(token)

        // Try to get email from DOM if available
        const emailEl = document.getElementById("verification-email")
        if (emailEl) setEmail(emailEl.innerText)

        // Parse server messages
        const messagesEl = document.getElementById("server-messages")
        if (messagesEl && messagesEl.textContent) {
            try {
                const messages = JSON.parse(messagesEl.textContent)
                messages.forEach((msg: any) => {
                    if (msg.level.includes("error") || msg.level.includes("warning")) {
                        setError(msg.message)
                    } else if (msg.level.includes("success")) {
                        setSuccess(msg.message)
                    }
                })
            } catch (e) {
                console.error("Failed to parse messages", e)
            }
        }
    }, [])

    const handleSubmit = () => {
        setIsLoading(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
                        <span className="text-2xl font-bold">+</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">HealthTrack+</h1>
                </div>

                <Card className="border-border shadow-xl">
                    <CardHeader className="space-y-1 text-center pb-2">
                        <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl font-bold">Verify your Email</CardTitle>
                        <CardDescription>
                            We've sent a 6-digit code to <br />
                            <span className="font-medium text-foreground">{email || "your email address"}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        {error && (
                            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="bg-green-50 text-green-900 border-green-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <form method="POST" action="/accounts/verify-otp/" onSubmit={handleSubmit} className="space-y-4">
                            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

                            <div className="space-y-2">
                                <Label htmlFor="otp" className="sr-only">One-Time Password</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="0 0 0 0 0 0"
                                    className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-muted/50"
                                    maxLength={6}
                                    pattern="\d{6}"
                                    autoComplete="one-time-code"
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify Account
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center text-sm border-t bg-muted/20 pt-6">
                        <p className="text-muted-foreground">
                            Didn't receive the code?{" "}
                            <a href="/accounts/register/" className="text-primary font-medium hover:underline">
                                Resend
                            </a>
                        </p>
                        <a href="/accounts/register/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Change email address
                        </a>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
