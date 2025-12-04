import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage, router } from '@inertiajs/react';
import { User, Mail, Calendar, ChevronRight, LogOut, Shield, Trash2, Globe } from 'lucide-react';
import MobileLayout from '@/layouts/mobile-layout';
import { useTranslation } from '@/hooks/use-translation';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { t, locale, setLocale } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleDeleteAccount = () => {
        router.delete('/settings/profile', {
            data: { password: deletePassword },
            onSuccess: () => setShowDeleteConfirm(false),
        });
    };

    const toggleLanguage = () => {
        const newLocale = locale === 'es' ? 'en' : 'es';
        setLocale(newLocale);
    };

    return (
        <MobileLayout>
            <Head title={t('nav.profile')} />

            {/* Header */}
            <header className="bg-background border-b border-border">
                <div className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold">{auth.user.name}</h1>
                    <p className="text-sm text-muted-foreground">{auth.user.email}</p>
                </div>
            </header>

            {/* Content */}
            <main className="p-4 space-y-6 pb-24">
                {/* Profile Form */}
                <section className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-semibold">{t('profile.information')}</h2>
                        <p className="text-sm text-muted-foreground">{t('profile.update_info')}</p>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="p-4 space-y-4"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('auth.name')}</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={auth.user.name}
                                            required
                                            autoComplete="name"
                                            className="pl-10"
                                            placeholder={t('auth.name')}
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('auth.email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            defaultValue={auth.user.email}
                                            required
                                            autoComplete="username"
                                            className="pl-10"
                                            placeholder={t('auth.email')}
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                            {t('profile.email_unverified')}{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-medium underline"
                                            >
                                                {t('profile.resend_verification')}
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <p className="mt-2 text-sm font-medium text-green-600">
                                                {t('profile.verification_sent')}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Button disabled={processing} className="flex-1">
                                        {t('common.save')}
                                    </Button>
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600">✓ {t('common.saved')}</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                {/* Quick Links */}
                <section className="bg-card rounded-xl border border-border overflow-hidden">
                    <Link
                        href="/my-events"
                        className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className="font-medium">{t('auth.my_events')}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>

                    <div className="border-t border-border" />

                    <Link
                        href="/settings/password"
                        className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium">{t('profile.change_password')}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>

                    <div className="border-t border-border" />

                    <button
                        onClick={toggleLanguage}
                        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="font-medium">{t('profile.language')}</span>
                        </div>
                        <span className="text-muted-foreground">
                            {locale === 'es' ? 'Español' : 'English'}
                        </span>
                    </button>
                </section>

                {/* Danger Zone */}
                <section className="space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium">{t('auth.logout')}</span>
                    </button>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="font-medium text-red-600 dark:text-red-400">{t('profile.delete_account')}</span>
                    </button>
                </section>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-background rounded-xl p-6 w-full max-w-sm space-y-4">
                            <h3 className="text-lg font-bold text-red-600">{t('profile.delete_account')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('profile.delete_warning')}
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="delete-password">{t('auth.password')}</Label>
                                <Input
                                    id="delete-password"
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder={t('profile.enter_password')}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                    }}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={handleDeleteAccount}
                                    disabled={!deletePassword}
                                >
                                    {t('common.delete')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </MobileLayout>
    );
}
