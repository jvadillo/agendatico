import { Form, Head, Link } from '@inertiajs/react';
import { Apple } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';

export default function Register() {
    const { t } = useTranslation();

    return (
        <div className="mobile-container">
            <div className="min-h-screen bg-background flex flex-col">
                <Head title={t('auth.register')} />

            {/* Content */}
            <main className="flex-1 px-6 pt-12">
                <h1 className="text-3xl font-bold mb-2">{t('auth.register')}</h1>
                <p className="text-muted-foreground mb-6">
                    {t('auth.have_account')}{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        {t('auth.login')}
                    </Link>
                </p>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Name Input */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base font-medium">
                                    {t('auth.name')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    placeholder={t('auth.name_placeholder')}
                                    className="h-12 pl-4 pr-4 text-base bg-secondary/30 border-0 rounded-xl"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-base font-medium">
                                    {t('auth.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder={t('auth.email_placeholder')}
                                    className="h-12 pl-4 pr-4 text-base bg-secondary/30 border-0 rounded-xl"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-base font-medium">
                                    {t('auth.password')}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder={t('auth.password_placeholder')}
                                    className="h-12 pl-4 pr-4 text-base bg-secondary/30 border-0 rounded-xl"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-base font-medium">
                                    {t('auth.confirm_password')}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder={t('auth.password_placeholder')}
                                    className="h-12 pl-4 pr-4 text-base bg-secondary/30 border-0 rounded-xl"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Register Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {t('auth.register')}
                            </Button>
                        </>
                    )}
                </Form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-background text-muted-foreground">
                            {t('auth.or')}
                        </span>
                    </div>
                </div>

                {/* Social Login - All in one row */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => { window.location.href = '/auth/google/redirect'; }}
                        className="flex items-center justify-center h-12 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => { window.location.href = '/auth/apple/redirect'; }}
                        className="flex items-center justify-center h-12 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                        <Apple className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => { window.location.href = '/auth/facebook/redirect'; }}
                        className="flex items-center justify-center h-12 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </button>
                </div>

                {/* Continue as Guest */}
                <div className="mt-4 text-center">
                    <Link
                        href="/"
                        className="text-primary font-medium hover:underline"
                    >
                        {t('auth.continue_guest')}
                    </Link>
                </div>
            </main>

                {/* Footer */}
                <footer className="p-4 text-center text-xs text-muted-foreground">
                    <p>
                        {t('auth.terms_notice')}{' '}
                        <Link href="/terms" className="text-primary underline">{t('auth.terms')}</Link>
                        {' '}{t('auth.and')}{' '}
                        <Link href="/privacy" className="text-primary underline">{t('auth.privacy')}</Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
