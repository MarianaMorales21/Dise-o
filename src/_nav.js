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
    badge: {
      color: 'info',
      text: 'NEW',
    },
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
        to: '/login',
      },
    ],
  },
]

export default _nav



/*
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
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const itemHoverStyle = {
  transition: 'background-color 0.3s',
}

const itemHoverEvents = {
  onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = 'grey'),
  onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = 'transparent'),
}

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />, 
    style: itemHoverStyle,
    ...itemHoverEvents,
  },
  {
    component: CNavTitle,
    name: 'Modulos',
  },
  {
    component: CNavGroup,
    name: 'Informacion Personal',
    to: '/base',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Atleta',
        to: '/base/accordion',
        style: itemHoverStyle,
        ...itemHoverEvents,
      },
      {
        component: CNavItem,
        name: 'Representante',
        to: '/base/breadcrumbs',
        style: itemHoverStyle,
        ...itemHoverEvents,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Clasificacion de atletas',
    to: '/buttons',
    icon: <CIcon icon={cilClearAll} customClassName="nav-icon" />, 
    items: [
      {
        component: CNavItem,
        name: 'Categorias',
        to: '/buttons/buttons',
        style: itemHoverStyle,
        ...itemHoverEvents,
      },
      {
        component: CNavItem,
        name: 'Subcategorias',
        to: '/buttons/button-groups',
        style: itemHoverStyle,
        ...itemHoverEvents,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Entrenadores',
    to: '/theme/typography',
    icon: <CIcon icon={cilSoccer} customClassName="nav-icon" />, 
    style: itemHoverStyle,
    ...itemHoverEvents,
  },
  {
    component: CNavItem,
    name: 'Entrenamientos',
    to: '/theme/typography',
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />, 
    style: itemHoverStyle,
    ...itemHoverEvents,
  },
  {
    component: CNavItem,
    name: 'Campeonatos',
    to: '/charts',
    icon: <CIcon icon={cilBadge} customClassName="nav-icon" />, 
    style: itemHoverStyle,
    ...itemHoverEvents,
  },
  {
    component: CNavGroup,
    name: 'Actualizaciones',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuario',
        to: '/login',
        style: itemHoverStyle,
        ...itemHoverEvents,
      },
      {
        component: CNavItem,
        name: 'Clave',
        to: '/login',
        style: itemHoverStyle,
        ...itemHoverEvents,
      },
    ],
  },
]

export default _nav*/
