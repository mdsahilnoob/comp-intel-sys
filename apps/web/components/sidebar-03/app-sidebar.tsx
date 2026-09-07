'use client';

import { motion } from 'framer-motion';
import { ArrowUpRightIcon as LinkIcon } from '@/components/ui/arrow-up-right';
import { BoxIcon as DollarSign, BoxIcon as Package2, BoxIcon as ShoppingBag, BoxIcon as Store, BoxIcon as Users } from '@/components/ui/box';
import { ChartNoAxesColumnIncreasingIcon as Activity, ChartNoAxesColumnIncreasingIcon as PieChart, ChartNoAxesColumnIncreasingIcon as TrendingUp } from '@/components/ui/chart-no-axes-column-increasing';
import { LayersIcon as Home, LayersIcon as Infinity, LayersIcon as Sparkles } from '@/components/ui/layers';
import { ShieldCheckIcon as Percent } from '@/components/ui/shield-check';
import { SlidersHorizontalIcon as Settings } from '@/components/ui/sliders-horizontal';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/sidebar-03/logo';
import type { Route } from '@/components/sidebar-03/nav-main';
import DashboardNavigation from '@/components/sidebar-03/nav-main';
import { NotificationsPopover } from '@/components/sidebar-03/nav-notifications';
import { TeamSwitcher } from '@/components/sidebar-03/team-switcher';

const sampleNotifications = [
  {
    id: '1',
    avatar: '/avatars/01.png',
    fallback: 'OM',
    text: 'New order received.',
    time: '10m ago',
  },
  {
    id: '2',
    avatar: '/avatars/02.png',
    fallback: 'JL',
    text: 'Server upgrade completed.',
    time: '1h ago',
  },
  {
    id: '3',
    avatar: '/avatars/03.png',
    fallback: 'HH',
    text: 'New user signed up.',
    time: '2h ago',
  },
];

const dashboardRoutes: Route[] = [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={16} className="size-4" />,
    link: '#',
  },
  {
    id: 'products',
    title: 'Products',
    icon: <Package2 size={16} className="size-4" />,
    link: '#',
    subs: [
      {
        title: 'Catalogue',
        link: '#',
        icon: <Package2 size={16} className="size-4" />,
      },
      {
        title: 'Checkout Links',
        link: '#',
        icon: <LinkIcon size={16} className="size-4" />,
      },
      {
        title: 'Discounts',
        link: '#',
        icon: <Percent size={16} className="size-4" />,
      },
    ],
  },
  {
    id: 'usage-billing',
    title: 'Usage Billing',
    icon: <PieChart size={16} className="size-4" />,
    link: '#',
    subs: [
      {
        title: 'Meters',
        link: '#',
        icon: <PieChart size={16} className="size-4" />,
      },
      {
        title: 'Events',
        link: '#',
        icon: <Activity size={16} className="size-4" />,
      },
    ],
  },
  {
    id: 'benefits',
    title: 'Benefits',
    icon: <Sparkles size={16} className="size-4" />,
    link: '#',
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: <Users size={16} className="size-4" />,
    link: '#',
  },
  {
    id: 'sales',
    title: 'Sales',
    icon: <ShoppingBag size={16} className="size-4" />,
    link: '#',
    subs: [
      {
        title: 'Orders',
        link: '#',
        icon: <ShoppingBag size={16} className="size-4" />,
      },
      {
        title: 'Subscriptions',
        link: '#',
        icon: <Infinity size={16} className="size-4" />,
      },
    ],
  },
  {
    id: 'storefront',
    title: 'Storefront',
    icon: <Store size={16} className="size-4" />,
    link: '#',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <TrendingUp size={16} className="size-4" />,
    link: '#',
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: <DollarSign size={16} className="size-4" />,
    link: '#',
    subs: [
      { title: 'Incoming', link: '#' },
      { title: 'Outgoing', link: '#' },
      { title: 'Payout Account', link: '#' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings size={16} className="size-4" />,
    link: '#',
    subs: [
      { title: 'General', link: '#' },
      { title: 'Webhooks', link: '#' },
      { title: 'Custom Fields', link: '#' },
    ],
  },
];

const teams = [
  { id: '1', name: 'Alpha Inc.', logo: Logo, plan: 'Free' },
  { id: '2', name: 'Beta Corp.', logo: Logo, plan: 'Free' },
  { id: '3', name: 'Gamma Tech', logo: Logo, plan: 'Free' },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader
        className={cn(
          'flex md:pt-3.5',
          isCollapsed
            ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start'
            : 'flex-row items-center justify-between'
        )}
      >
        <a className="flex items-center gap-2" href="#">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Acme
            </span>
          )}
        </a>

        <motion.div
          animate={{ opacity: 1 }}
          className={cn(
            'flex items-center gap-2',
            isCollapsed ? 'flex-row md:flex-col-reverse' : 'flex-row'
          )}
          initial={{ opacity: 0 }}
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
