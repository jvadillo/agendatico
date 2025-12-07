import { Link, usePage } from '@inertiajs/react';
import { Home, PlusCircle, Heart, User } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { ModalProvider, useModal } from '@/contexts/modal-context';
import { DesktopHeader } from '@/components/desktop-header';
import type { ReactNode } from 'react';

interface MobileLayoutProps {
    children: ReactNode;
    hideNav?: boolean;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

function MobileLayoutInner({ children, hideNav = false }: MobileLayoutProps) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const { url } = usePage();
    const { isModalOpen } = useModal();

    const navItems = [
        { href: '/', icon: Home, label: t('nav.home'), match: (url: string) => url === '/' || url.startsWith('/events') && !url.includes('/publish') },
        { href: '/publish', icon: PlusCircle, label: t('nav.publish'), match: (url: string) => url === '/publish' },
        { href: auth.user ? '/favorites' : '/login', icon: Heart, label: t('nav.favorites'), match: (url: string) => url === '/favorites' },
        { href: auth.user ? '/settings/profile' : '/login', icon: User, label: t('nav.profile'), match: (url: string) => url.startsWith('/settings') || url === '/login' || url === '/register' },
    ];

    const shouldHideNav = hideNav || isModalOpen;

    return (
        <>
            {/* Desktop Header - hidden on mobile */}
            <DesktopHeader />

            {/* Main content wrapper */}
            <div className="responsive-container">
                {children}

                {/* Bottom nav - only on mobile */}
                {!shouldHideNav && (
                    <nav className="bottom-nav md:hidden">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'nav-item',
                                    item.match(url) && 'active'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </>
    );
}

export default function MobileLayout(props: MobileLayoutProps) {
    return (
        <ModalProvider>
            <MobileLayoutInner {...props} />
        </ModalProvider>
    );
}
