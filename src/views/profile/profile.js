import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CCol,
  CContainer,
  CRow,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { helpHttp } from '../../helpHttp';

const Profile = () => {
  const api = helpHttp();
  const navigate = useNavigate();
  const urlUsers = 'https://json-ymsx.onrender.com/TmUsuario';

  const [user, setUser] = useState({
    id: '',
    UsuIdUsu: '',
    UsuNombr: '',
    UsuApell: '',
    UsuEmail: '',
    UsuContr: '',
    UsuRol: '',
  });

  const [originalUser, setOriginalUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color });
    setTimeout(() => {
      setAlert({ show: false, message: '', color: '' });
    }, 4000);
  };

  const loadUserData = () => {
    try {
      const userSession = localStorage.getItem('userSession');
      const isAuthenticated = localStorage.getItem('isAuthenticated');

      if (!userSession || !isAuthenticated) {
        showAlert('Sesión no válida. Redirigiendo al login...', 'danger');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }

      const userData = JSON.parse(userSession);
      console.log('Datos del usuario desde localStorage:', userData);

      // Cargar datos del usuario con campos adicionales si existen
      const userProfile = {
        id: userData.id || '',
        UsuIdUsu: userData.UsuIdUsu || '',
        UsuNombr: userData.UsuNombr || '',
        UsuApell: userData.UsuApell || '',
        UsuEmail: userData.UsuEmail || '',
        UsuContr: userData.UsuContr || '',
        UsuRol: userData.UsuRol || '',

      };

      setUser(userProfile);
      setOriginalUser({ ...userProfile });

    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      showAlert('Error al cargar datos del usuario', 'danger');
    }
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Guardar cambios
      await saveUserData();
    } else {
      // Activar modo edición
      setIsEditing(true);
    }
  };

  const saveUserData = async () => {
    setIsLoading(true);

    try {
      // Validar campos requeridos
      if (!user.UsuNombr.trim() || !user.UsuApell.trim() || !user.UsuEmail.trim()) {
        showAlert('Nombre, apellido y email son campos requeridos', 'danger');
        setIsLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.UsuEmail)) {
        showAlert('El formato del email no es válido', 'danger');
        setIsLoading(false);
        return;
      }

      console.log('Guardando usuario con ID:', user.id);
      console.log('Datos a guardar:', user);

      // Actualizar en la base de datos
      const response = await api.put(`${urlUsers}/${user.id}`, { body: user });

      if (!response.err) {
        // Actualizar localStorage con los nuevos datos
        const updatedSession = {
          ...user,
          loginTime: JSON.parse(localStorage.getItem('userSession')).loginTime
        };
        localStorage.setItem('userSession', JSON.stringify(updatedSession));

        setOriginalUser({ ...user });
        setIsEditing(false);
        showAlert('Perfil actualizado exitosamente', 'success');
      } else {
        showAlert('Error al actualizar el perfil', 'danger');
        console.error('Error en la actualización:', response);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      showAlert('Error de conexión al guardar', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setUser({ ...originalUser });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showAlert('Ambos campos de contraseña son requeridos', 'danger');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Las contraseñas no coinciden', 'danger');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('La contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = { ...user, UsuContr: newPassword };

      const response = await api.put(`${urlUsers}/${user.id}`, { body: updatedUser });

      if (!response.err) {
        // Actualizar localStorage
        const updatedSession = {
          ...updatedUser,
          loginTime: JSON.parse(localStorage.getItem('userSession')).loginTime
        };
        localStorage.setItem('userSession', JSON.stringify(updatedSession));

        setUser(updatedUser);
        setNewPassword('');
        setConfirmPassword('');
        setModalChangePassword(false);
        showAlert('Contraseña cambiada exitosamente', 'success');
      } else {
        showAlert('Error al cambiar la contraseña', 'danger');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      showAlert('Error de conexión al cambiar contraseña', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <CContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Información Personal de Usuario</h1>
        <CButton
          onClick={handleLogout}
          style={{ backgroundColor: '#dc3545', color: 'white' }}
        >
          Cerrar Sesión
        </CButton>
      </div>

      {alert.show && (
        <CAlert color={alert.color} className="mb-3">
          {alert.message}
        </CAlert>
      )}

      <CForm>
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              label="Nombre"
              value={user.UsuNombr}
              onChange={(e) => handleInputChange('UsuNombr', e.target.value)}
              readOnly={!isEditing}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Apellido"
              value={user.UsuApell}
              onChange={(e) => handleInputChange('UsuApell', e.target.value)}
              readOnly={!isEditing}
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              label="Email"
              type="email"
              value={user.UsuEmail}
              onChange={(e) => handleInputChange('UsuEmail', e.target.value)}
              readOnly={!isEditing}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormSelect
              label="Rol"
              value={user.UsuRol}
              readOnly={true}
              disabled={true}
            >
              <option value="administracion">Administración</option>
              <option value="presidente">Presidente</option>
              <option value="entrenador">Entrenador</option>
            </CFormSelect>
          </CCol>
        </CRow>
      </CForm>

      <CRow style={{ marginTop: "20px", marginBottom: "20px" }}>
        <CCol md={12}>
          {!isEditing ? (
            <CButton
              onClick={handleEditToggle}
              style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
              disabled={isLoading}
            >
              Editar Perfil
            </CButton>
          ) : (
            <>
              <CButton
                onClick={handleEditToggle}
                style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </CButton>
              <CButton
                onClick={handleCancelEdit}
                style={{ backgroundColor: 'gray', color: 'white', marginRight: '10px' }}
                disabled={isLoading}
              >
                Cancelar
              </CButton>
            </>
          )}

          <CButton
            onClick={() => setModalChangePassword(true)}
            style={{ backgroundColor: 'red', color: 'white' }}
            disabled={isLoading}
          >
            Cambiar Contraseña
          </CButton>
        </CCol>
      </CRow>

      {/* Modal para cambiar contraseña */}
      <CModal visible={modalChangePassword} onClose={() => setModalChangePassword(false)}>
        <CModalHeader>
          <CModalTitle>Cambiar Contraseña</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="password"
              label="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-3"
              required
            />
            <CFormInput
              type="password"
              label="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
            onClick={() => {
              setModalChangePassword(false);
              setNewPassword('');
              setConfirmPassword('');
            }}
            disabled={isLoading}
          >
            Cancelar
          </CButton>
          <CButton
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Profile;