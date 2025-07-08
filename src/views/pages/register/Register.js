import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEnvelopeClosed, cilPeople } from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { helpHttp } from '../../../helpHttp';
const Register = () => {
  const api = helpHttp()
  const navigate = useNavigate()
  const urlUsers = 'https://json-ymsx.onrender.com/TtUsuarios'

  const [formData, setFormData] = useState({
    UsuNombr: '',
    UsuApell: '',
    UsuEmail: '',
    UsuContr: '',
    confirmPassword: '',
    UsuRol: ''
  })

  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [isLoading, setIsLoading] = useState(false)

  const generateId = () => Math.floor(Math.random() * 10000)

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
    // Validar campos vacíos
    if (!formData.UsuNombr.trim()) {
      showAlert('El nombre es requerido', 'danger')
      return false
    }

    if (!formData.UsuApell.trim()) {
      showAlert('El apellido es requerido', 'danger')
      return false
    }

    if (!formData.UsuEmail.trim()) {
      showAlert('El email es requerido', 'danger')
      return false
    }

    if (!formData.UsuContr.trim()) {
      showAlert('La contraseña es requerida', 'danger')
      return false
    }

    if (!formData.confirmPassword.trim()) {
      showAlert('Debe confirmar la contraseña', 'danger')
      return false
    }

    if (!formData.UsuRol) {
      showAlert('Debe seleccionar un rol', 'danger')
      return false
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.UsuEmail)) {
      showAlert('El formato del email no es válido', 'danger')
      return false
    }

    // Validar que las contraseñas coincidan
    if (formData.UsuContr !== formData.confirmPassword) {
      showAlert('Las contraseñas no coinciden', 'danger')
      return false
    }

    // Validar longitud mínima de contraseña
    if (formData.UsuContr.length < 6) {
      showAlert('La contraseña debe tener al menos 6 caracteres', 'danger')
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
      // Verificar si el email ya existe
      const existingUsers = await api.get(urlUsers)
      if (!existingUsers.err) {
        const emailExists = existingUsers.some(user => user.UsuEmail === formData.UsuEmail)
        if (emailExists) {
          showAlert('Este email ya está registrado', 'danger')
          setIsLoading(false)
          return
        }
      }

      // Crear el objeto usuario sin confirmPassword
      const userData = {
        UsuIdUsu: generateId(),
        UsuNombr: formData.UsuNombr.trim(),
        UsuApell: formData.UsuApell.trim(),
        UsuEmail: formData.UsuEmail.trim().toLowerCase(),
        UsuContr: formData.UsuContr,
        UsuRol: formData.UsuRol
      }

      console.log('Datos a enviar:', userData)

      const response = await api.post(urlUsers, { body: userData })

      if (!response.err) {
        showAlert('Usuario registrado exitosamente', 'success')

        // Limpiar formulario
        setFormData({
          UsuNombr: '',
          UsuApell: '',
          UsuEmail: '',
          UsuContr: '',
          confirmPassword: '',
          UsuRol: ''
        })

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        showAlert('Error al registrar usuario. Intente nuevamente.', 'danger')
        console.error('Error en el registro:', response)
      }
    } catch (error) {
      showAlert('Error de conexión. Intente nuevamente.', 'danger')
      console.error('Error en handleSubmit:', error)
    } finally {
      setIsLoading(false)
    }
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
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Crear Nuevo Usuario</p>

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
                      name="UsuNombr"
                      placeholder="Nombre"
                      autoComplete="given-name"
                      value={formData.UsuNombr}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="UsuApell"
                      placeholder="Apellido"
                      autoComplete="family-name"
                      value={formData.UsuApell}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      name="UsuEmail"
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.UsuEmail}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPeople} />
                    </CInputGroupText>
                    <CFormSelect
                      name="UsuRol"
                      value={formData.UsuRol}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar Rol</option>
                      <option value="administracion">Administración</option>
                      <option value="presidente">Presidente</option>
                      <option value="entrenador">Entrenador</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="UsuContr"
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      value={formData.UsuContr}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirmar Contraseña"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </CInputGroup>

                  <div className="d-grid gap-2">
                    <CButton
                      type="submit"
                      style={{ backgroundColor: '#68ddbd' }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registrando...' : 'Crear Usuario'}
                    </CButton>

                    <Link to="/login" className="text-center mt-2">
                      <small className="text-body-secondary">
                        ¿Ya tienes cuenta? Inicia sesión aquí
                      </small>
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register