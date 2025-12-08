import { Link, usePage } from '@inertiajs/react';
import { Home, PlusCircle, Heart, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string;
        } | null;
    };
    [key: string]: unknown;
}

export function DesktopHeader() {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const { url } = usePage();
    const getInitials = useInitials();

    const navItems = [
        { href: '/', label: t('nav.home'), icon: Home, match: (url: string) => url === '/' || (url.startsWith('/events') && !url.includes('/publish')) },
        { href: '/publish', label: t('nav.publish'), icon: PlusCircle, match: (url: string) => url === '/publish' },
    ];

    return (
        <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Agendatico" className="h-8" />
                </Link>

                {/* Right side: Navigation + User Menu */}
                <div className="flex items-center gap-2">
                    {/* Navigation links */}
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                    item.match(url)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 px-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium hidden lg:inline">{auth.user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium">{auth.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
                                        <Heart className="w-4 h-4" />
                                        {t('nav.favorites')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="w-4 h-4" />
                                        {t('nav.profile')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/logout" method="post" as="button" className="flex items-center gap-2 w-full cursor-pointer text-destructive">
                                        <LogOut className="w-4 h-4" />
                                        {t('auth.logout')}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    {t('auth.login')}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">
                                    {t('auth.register')}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
