import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilStar, cilNewspaper, cilControl } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Usage Data',
  //   to: '/usage',
  //   icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Arcade Mode',
  //   to: '/arcade',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Announcements',
    to: '/announcements',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'FAQs',
    to: '/faqs',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Contract',
    to: '/contract',
    icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
  },
]

export default _nav
