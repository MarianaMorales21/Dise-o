import React, { useState } from 'react';
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
} from '@coreui/react';

const Profile = () => {
  const [user, setUser] = useState({
    id: 'P001',
    nombre: 'Marta',
    apellido: 'Perez',
    direccionTrabajo: 'Tariba',
    direccionHogar: 'Tariba',
    ocupacion: 'Madre',
    telefono: '04121617297',
    nacionalidad: 'Venezuela',
    cedula: '30781815'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <CContainer>
      <h1>Información Personal de Usuario</h1>
      <CForm>
        <CRow>
          <CCol md={6}>
            <CFormInput
              label="Nombre"
              value={user.nombre}
              onChange={(e) => setUser({ ...user, nombre: e.target.value })}
              readOnly={!isEditing}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormSelect
              label="Nacionalidad"
              value={user.nacionalidad}
              onChange={(e) => setUser({ ...user, nacionalidad: e.target.value })}
              readOnly={!isEditing}
              required
            >
              <option value="Venezuela">Venezuela</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow>
          <CCol md={6}>
            <CFormInput
              label="Cédula"
              value={user.cedula}
              onChange={(e) => setUser({ ...user, cedula: e.target.value })}
              readOnly={!isEditing}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Dirección"
              value={user.direccionHogar}
              onChange={(e) => setUser({ ...user, direccionHogar: e.target.value })}
              readOnly={!isEditing}
              required
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol md={6}>
            <CFormInput
              label="Ocupación"
              value={user.ocupacion}
              onChange={(e) => setUser({ ...user, ocupacion: e.target.value })}
              readOnly={!isEditing}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Teléfono"
              value={user.telefono}
              onChange={(e) => setUser({ ...user, telefono: e.target.value })}
              readOnly={!isEditing}
              required
            />
          </CCol>
        </CRow>
      </CForm>

      <CRow style={{ marginTop: "8px", marginBottom: "8px" }}>
        <CCol md={6}>
          {!isEditing && (
            <CButton onClick={handleEditToggle} style={{ backgroundColor: 'green', color: 'white' }}>
              Editar
            </CButton>
          )}
          {isEditing && (
            <CButton onClick={handleEditToggle} style={{ backgroundColor: 'blue', color: 'white' }}>
              Guardar
            </CButton>
          )}
          <CButton onClick={() => setModalChangePassword(true)} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
            Cambiar Contraseña
          </CButton>
        </CCol>
      </CRow>

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
          <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setModalChangePassword(false)}>
            Cancelar
          </CButton>
          <CButton style={{ backgroundColor: 'green', color: 'white' }}>
            Cambiar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Profile;