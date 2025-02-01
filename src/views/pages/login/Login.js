import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'



const Login = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(https://images.theconversation.com/files/582820/original/file-20240319-30-8sm5fb.jpg?ixlib=rb-4.1.0&rect=0%2C189%2C3957%2C1978&q=45&auto=format&w=1356&h=668&fit=crop)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
      }}>
      </div>
      <CContainer style={{ zIndex: 2 }}>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4" style={{ backgroundColor: '#03bb85' }}>
                <CCardBody>
                  <CForm>
                    <h1>Iniciar sesión</h1>
                    <p className="text-body-secondary">Inicia sesión en tu cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>



                        <Link to="/dashboard">
                          <CButton className="px-4" style={{ backgroundColor: '#9ce0db' }} >
                            Ingresar
                          </CButton>
                        </Link>

                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="black" className="px-0">
                          Olvido Contraseña
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard style={{ width: '44%', backgroundColor: '#d5ffff' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Registrarse</h2>
                    <p>
                      ¿No estas registrado?. Hazlo ahora y tendrás acceso a todos nuestros servicios permitiéndote tener información al instante de los mismo.
                    </p>
                    <Link to="/register">
                      <CButton className="mt-3" tabIndex={-1} style={{ backgroundColor: '#9ce0db' }}>
                        Registrate Ahora!!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
