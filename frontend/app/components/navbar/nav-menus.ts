import { RectangleGroupIcon, ClockIcon, CalendarDaysIcon, ClipboardDocumentListIcon, CogIcon } from '@heroicons/vue/24/outline'
import type { FunctionalComponent, SVGAttributes } from 'vue'

export interface MenuItem {
  text: string
  path: string
  icon: FunctionalComponent<SVGAttributes>
}

// Add icons to nav items ? @Bombex
export const MenuItems: MenuItem[] = [
  {
    text: 'dashboard',
    path: '/dashboard',
    icon: RectangleGroupIcon,
  },
  {
    text: 'timeRecording',
    path: '/time-recording',
    icon: ClockIcon,
  },
  {
    text: 'calendar',
    path: '/calendar',
    icon: CalendarDaysIcon,
  },
  {
    text: 'projects',
    path: '/projects',
    icon: ClipboardDocumentListIcon,
  },
  {
    text: 'settings',
    path: '/settings',
    icon: CogIcon,
  },
]
