import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBadge,

  cilFeaturedPlaylist,
  cilSoccer,
  cilGroup,
  cilSpeedometer,
  cilLibrary,
  cilClearAll,
  cilFolderOpen,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Modulos',
  },

  {
    component: CNavItem,
    name: 'Inscripciones',
    to: '/inscriptions',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Clasificacion de atletas',
    to: '/subcategory',
    icon: <CIcon icon={cilClearAll} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Entrenadores',
    to: '/trainer',
    icon: <CIcon icon={cilSoccer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Entrenamientos',
    to: '/schedule',
    icon: <CIcon icon={
      cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Campeonatos',
    to: '/tournaments',
    icon: <CIcon icon={cilBadge} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Informacion',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Busqueda',
        to: '/search',
      },
      {
        component: CNavItem,
        name: 'Representantes',
        to: '/person',
      },
      {
        component: CNavItem,
        name: 'Atletas',
        to: '/athlete',
      },

    ],

  },
  {
    component: CNavGroup,
    name: 'Actualizaciones',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuario',
        to: '/profile',
      },
      {
        component: CNavItem,
        name: 'Cerrar Sesion',
        to: '/',
      },
    ],
  },
]

export default _nav


