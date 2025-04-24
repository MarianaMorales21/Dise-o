import React from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { color } from 'chart.js/helpers'
import { useEffect, useState } from 'react'
import { helpHttp } from '../../helpHttp'
const Dashboard = () => {
  const api = helpHttp();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlEntr = await api.get('https://json-ymsx.onrender.com/TtEntre');
        const urlUsers = await api.get('https://json-ymsx.onrender.com/TtUsuarios');
        const urlCateg = await api.get('https://json-ymsx.onrender.com/TmCateg');
        const urlAtle = await api.get('https://json-ymsx.onrender.com/TtAtlet');
        const urlRepre = await api.get('https://json-ymsx.onrender.com/TtRepres');
        const urlEqui = await api.get('https://json-ymsx.onrender.com/TmEquip');

        const processedData = [
          { title: 'Usuarios', value: `${urlUsers.length} Usuarios`, percent: 100, color: 'success' },
          { title: 'Entrenadores', value: `${urlEntr.length} Entrenadores`, percent: 100, color: 'success' },
          { title: 'Atletas', value: `${urlAtle.length} Atletas`, percent: 80, color: 'danger' },
          { title: 'Representantes', value: `${urlRepre.length} Representantes`, percent: 40, color: 'primary' },
          { title: 'Categorias', value: `${urlCateg.length} Categorias`, percent: 60, color: 'warning' },
          { title: 'Equipos', value: `${urlEqui.length} Equipos`, percent: 100, color: 'info' },
        ];

        setProgressExample(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Marta Morantes',
        new: true,
        registered: '01/01/2025',
      },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      activity: 'Hace 10 segundos',
    },
    {
      avatar: { src: avatar2, status: 'success' },
      user: {
        name: 'Carlos Montes',
        new: true,
        registered: '01/01/2025',
      },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      activity: 'Hace 5 minutos ',
    },
    {
      avatar: { src: avatar3, status: 'success' },
      user: { name: 'Javier Perez', new: true, registered: '01/01/2025' },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      activity: 'Hace 1 hora',
    },
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CRow>
        <CCol lg={8}>
          <CCard className="mb-4">
            <CCardHeader>Tabla de Usuarios</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usuario</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Uso</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Actividad</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? 'Nuevo Usuario' : 'Recurrente'}</span> | Registrado:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Último inicio de sesión</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Próximas Actividades</CCardHeader>
            <CCardBody>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Entrenamiento de fútbol 22/04/2025
                  <span className="badge bg-success rounded-pill">Cumplido</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Dia de campeonatos
                  <span className="badge bg-warning rounded-pill">25 Abril</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Observacion de casa talentos
                  <span className="badge bg-warning rounded-pill">28 Abril</span>
                </li>
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}

export default Dashboard;
