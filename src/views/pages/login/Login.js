import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { helpHttp } from '../../../helpHttp'

const Login = () => {
  const api = helpHttp()
  const navigate = useNavigate()
  const urlUsers = 'https://json-ymsx.onrender.com/TtUsuarios'

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [isLoading, setIsLoading] = useState(false)

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => {
      setAlert({ show: false, message: '', color: '' })
    }, 4000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      showAlert('El email es requerido', 'danger')
      return false
    }

    if (!formData.password.trim()) {
      showAlert('La contraseña es requerida', 'danger')
      return false
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showAlert('El formato del email no es válido', 'danger')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      console.log('Intentando login con:', formData.email)

      // Obtener todos los usuarios
      const users = await api.get(urlUsers)

      if (users.err) {
        showAlert('Error de conexión. Intente nuevamente.', 'danger')
        setIsLoading(false)
        return
      }

      console.log('Usuarios obtenidos:', users)

      // Buscar usuario por email y contraseña
      const user = users.find(u =>
        u.UsuEmail.toLowerCase() === formData.email.toLowerCase().trim() &&
        u.UsuContr === formData.password
      )

      if (user) {
        console.log('Usuario encontrado:', user)

        // Guardar información del usuario en localStorage
        const userSession = {
          id: user.id,
          UsuIdUsu: user.UsuIdUsu,
          UsuNombr: user.UsuNombr,
          UsuApell: user.UsuApell,
          UsuEmail: user.UsuEmail,
          UsuRol: user.UsuRol,
          loginTime: new Date().toISOString()
        }

        localStorage.setItem('userSession', JSON.stringify(userSession))
        localStorage.setItem('isAuthenticated', 'true')

        showAlert(`¡Bienvenido ${user.UsuNombr} ${user.UsuApell}!`, 'success')

        // Limpiar formulario
        setFormData({
          email: '',
          password: ''
        })

        // Redirigir al dashboard después de 1.5 segundos
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)

      } else {
        console.log('Credenciales incorrectas')
        showAlert('Email o contraseña incorrectos', 'danger')
      }

    } catch (error) {
      console.error('Error en login:', error)
      showAlert('Error de conexión. Intente nuevamente.', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    showAlert('Funcionalidad de recuperación de contraseña no implementada', 'info')
  }

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
                  <CForm onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <p className="text-body-secondary">Inicia sesión en tu cuenta</p>

                    {alert.show && (
                      <CAlert color={alert.color} className="mb-3">
                        {alert.message}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          className="px-4"
                          style={{ backgroundColor: '#9ce0db' }}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Ingresando...' : 'Ingresar'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={handleForgotPassword}
                          disabled={isLoading}
                        >
                          ¿Olvidó su contraseña?
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
                      ¿No estás registrado? Hazlo ahora y tendrás acceso a todos nuestros servicios permitiéndote tener información al instante de los mismos.
                    </p>
                    <Link to="/register">
                      <CButton
                        className="mt-3"
                        tabIndex={-1}
                        style={{ backgroundColor: '#9ce0db' }}
                        disabled={isLoading}
                      >
                        ¡Regístrate Ahora!
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