import { element, exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/profile/profile'))
const Person = React.lazy(() => import('./views/person/person'))
const Athlete = React.lazy(() => import('./views/athletes/athletes'))
const SubCategory = React.lazy(() => import('./views/qualifying/qualifying'))
const Trainer = React.lazy(() => import('./views/trainer/trainer'))
const Schedule = React.lazy(() => import('./views/schedules/schedules'))
const Tournaments = React.lazy(() => import('./views/tournaments/tournaments'))
const Inscriptions = React.lazy(() => import('./views/inscriptions/inscriptions'))
const Search = React.lazy(() => import('./views/search/search'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Profile', name: 'Profile', element: Profile },
  { path: '/Person', name: 'Person', element: Person },
  { path: '/Athlete', name: 'Athlete', element: Athlete },
  { path: '/SubCategory', name: 'SubCategory', element: SubCategory },
  { path: '/Trainer', name: 'Trainer', element: Trainer },
  { path: '/Schedule', name: 'Schedule', element: Schedule },
  { path: '/Tournaments', name: 'Tournaments', element: Tournaments },
  { path: '/Inscriptions', name: 'Inscriptions', element: Inscriptions },
  { path: '/Search', name: 'Search', element: Search },
]

export default routes
