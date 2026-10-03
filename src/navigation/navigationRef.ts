import { RootStackParamList } from "@/src/types";
import { createNavigationContainerRef } from "@react-navigation/native";

// 2. Initialize the ref with the ParamList type
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Global Navigation Functions
 */

export function navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        // @ts-ignore - Navigation state can be complex with nested navigators
        navigationRef.navigate(name, params);
    }
}

export function goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
    }
}

/**
 * Specialized Navigators
 */

export function navigateToOrder(orderId: string) {
    navigate('TrackOrder', { orderId });
}

export function navigateToNotifications() {
    navigate('Notifications');
}

/**
 * Auth Navigation
 * Resetting the stack is better for Login/Logout to prevent 
 * users from clicking 'back' into a secured session.
 */
export function navigateToLogin() {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }
}