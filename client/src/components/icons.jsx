/**
 * Inline SVG icons (no icon library dependency).
 * All icons share the same 24x24 grid and inherit the current text colour.
 */

const Svg = ({ children, size = 18, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
);

export const IconDashboard = (props) => (
  <Svg {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1.6" />
    <rect x="14" y="3" width="7" height="5" rx="1.6" />
    <rect x="14" y="12" width="7" height="9" rx="1.6" />
    <rect x="3" y="16" width="7" height="5" rx="1.6" />
  </Svg>
);

export const IconStudents = (props) => (
  <Svg {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const IconCourses = (props) => (
  <Svg {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </Svg>
);

export const IconFaculty = (props) => (
  <Svg {...props}>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
  </Svg>
);

export const IconNotice = (props) => (
  <Svg {...props}>
    <path d="m3 11 18-5v12L3 13v-2Z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </Svg>
);

export const IconMenu = (props) => (
  <Svg {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const IconSearch = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const IconPlus = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconEdit = (props) => (
  <Svg {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Svg>
);

export const IconTrash = (props) => (
  <Svg {...props}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
);

export const IconClose = (props) => (
  <Svg {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const IconLogout = (props) => (
  <Svg {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </Svg>
);

export const IconCheck = (props) => (
  <Svg {...props}>
    <path d="m20 6-11 11-5-5" />
  </Svg>
);

export const IconAlert = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5v.01" />
  </Svg>
);

export const IconInfo = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" />
  </Svg>
);

export const IconChevronLeft = (props) => (
  <Svg {...props}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);

export const IconChevronRight = (props) => (
  <Svg {...props}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

export const IconArrowRight = (props) => (
  <Svg {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const IconInbox = (props) => (
  <Svg {...props}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z" />
  </Svg>
);

export const IconMail = (props) => (
  <Svg {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m3 6 9 7 9-7" />
  </Svg>
);

export const IconLock = (props) => (
  <Svg {...props}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const IconUser = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </Svg>
);

export const IconShield = (props) => (
  <Svg {...props}>
    <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const IconBuilding = (props) => (
  <Svg {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
  </Svg>
);

export const IconClock = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const IconSparkles = (props) => (
  <Svg {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
  </Svg>
);

export const IconIdCard = (props) => (
  <Svg {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <circle cx="8.5" cy="11" r="2" />
    <path d="M5.5 16.2a3.4 3.4 0 0 1 6 0M14 10h4.5M14 14h4.5" />
  </Svg>
);

export const IconCalendar = (props) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
  </Svg>
);

export const IconPhone = (props) => (
  <Svg {...props}>
    <path d="M15.5 21A14.5 14.5 0 0 1 3 8.5 3 3 0 0 1 6 5.5h1.5a1.5 1.5 0 0 1 1.5 1.3c.1.9.3 1.7.5 2.4a1.5 1.5 0 0 1-.5 1.7L8 12a12 12 0 0 0 4 4l1.1-1a1.5 1.5 0 0 1 1.7-.5c.8.3 1.6.4 2.4.5a1.5 1.5 0 0 1 1.3 1.5V18a3 3 0 0 1-3 3Z" />
  </Svg>
);

export const IconMapPin = (props) => (
  <Svg {...props}>
    <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const IconKey = (props) => (
  <Svg {...props}>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 9-9M17 3l3 3M14 6l3 3" />
  </Svg>
);

export const IconCheckCircle = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);
