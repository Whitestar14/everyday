'use client';

import { useEffect } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';
import { useMobile } from '@/hooks/useMobile';
import { useAppState } from '@/hooks/useAppState';
import { useUser } from '@/hooks/useUser';
import { useSettings } from '@/hooks/useSettings';
import { Toaster } from '@/components/ui/sonner';
import { Onboarding } from '@/components/features/onboarding/Onboarding';
import { LoadingState } from '@/components/layout/LoadingState';
import { DayDisplay } from '@/components/layout/DayDisplay';
import { DesktopNotSupported } from '@/components/layout/DesktopNotSupported';
import { InboxPage } from '@/components/pages/InboxPage';
import { TodayPage } from '@/components/pages/TodayPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { UpdateSystemBars } from '@/components/features/themes/StatusBars';
import { BottomNav } from '@/components/layout/BottomNav';
import SelectionBar from '@/components/layout/SelectionBar';
import { ModalProvider } from '@/contexts/ModalContext';
import { ModalContainer } from '@/components/modals/ModalContainer';
import { setupMidnightRunner } from '@/services/MidnightService';
import { requestPermission } from '@/services/NotificationService';

const DefaultRoute = () => {
    const [, navigate] = useLocation();
    useEffect(() => {
        navigate('/inbox');
    }, [navigate]);
    return null;
};

function App() {
    const isMobile = useMobile();
    useSettings();

    const {
        currentDay,
        isLoading,
        isDayDisplay,
        isOnboarding,
        handleOnboardingComplete,
    } = useAppState();

    useUser();

    useEffect(() => {
        setupMidnightRunner();
        requestPermission();
    }, []);

    if (!isMobile) {
        return <DesktopNotSupported />;
    }

    if (isLoading) {
        return <LoadingState />;
    }

    if (isDayDisplay) {
        return <DayDisplay day={currentDay} />;
    }

    if (isOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    return (
        <ModalProvider>
            <Router>
                <Switch>
                    <Route path="/inbox" component={InboxPage} />
                    <Route path="/today" component={TodayPage} />
                    <Route path="/settings" component={SettingsPage} />
                    <Route path="/" component={DefaultRoute} />
                </Switch>
                <BottomNav />
                <SelectionBar />
            </Router>

            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'var(--background)',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                    },
                }}
            />

            <ModalContainer />
            <UpdateSystemBars />
        </ModalProvider>
    );
}

export default App;
