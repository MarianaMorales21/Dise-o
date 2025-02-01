import React, { useEffect, useState } from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CAlert,
    CFormInput,
} from '@coreui/react';
import { helpHttp } from '../../helpHttp.js';

const Athlete = () => {
    const api = helpHttp();
    const urlAthletes = 'https://json-ymsx.onrender.com/TtAtlet';

    const [athletes, setAthletes] = useState([]);
    const [filteredAthletes, setFilteredAthletes] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [editData, setEditData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAthletes();
    }, []);

    useEffect(() => {
        setFilteredAthletes(
            athletes.filter(athlete =>
                athlete.AteCedul.includes(searchQuery) ||
                `${athlete.AteNombr} ${athlete.AteApell}`.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, athletes]);

    const fetchAthletes = async () => {
        const response = await api.get(urlAthletes);
        if (!response.err) {
            setAthletes(response);
            setFilteredAthletes(response);
        } else {
            showAlert('Error al cargar atletas', 'danger');
        }
    };

    const handleEdit = (athlete) => {
        setSelectedAthlete(athlete);
        setEditData(athlete);
        setEditModalOpen(true);
    };

    const handleDelete = (athlete) => {
        setSelectedAthlete(athlete);
        setModalOpen(true);
    };

    const handleUpdate = async () => {
        const response = await api.put(`${urlAthletes}/${selectedAthlete.AteIdAtl}`, {
            body: editData,
        });
        if (!response.err) {
            setAthletes((prev) =>
                prev.map((athlete) => (athlete.AteIdAtl === selectedAthlete.AteIdAtl ? { ...athlete, ...editData } : athlete))
            );
            showAlert('Atleta actualizado', 'success');
            setEditModalOpen(false);
        } else {
            showAlert('Error al actualizar atleta', 'danger');
        }
    };

    const handleConfirmDelete = async () => {
        const response = await api.del(`${urlAthletes}/${selectedAthlete.AteIdAtl}`);
        if (!response.err) {
            setAthletes((prev) => prev.filter((athlete) => athlete.AteIdAtl !== selectedAthlete.AteIdAtl));
            showAlert('Atleta eliminado', 'success');
            setModalOpen(false);
        } else {
            showAlert('Error al eliminar atleta', 'danger');
        }
    };

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' });
        }, 3000);
    };

    return (
        <CContainer>
            <h1>Lista de Atletas</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CFormInput
                type="search"
                placeholder="Buscar Cédula o Nombre"
                style={{ marginBottom: '15px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <CRow>
                {filteredAthletes.map((athlete) => (
                    <CCol sm="6" key={athlete.AteIdAtl} className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <CCardTitle>{athlete.AteNombr} {athlete.AteApell}</CCardTitle>
                            </CCardHeader>
                            <CCardBody>
                                <p>Cédula: {athlete.AteCedul}</p>
                                <p>Fecha de Nacimiento: {athlete.AteFecNa}</p>
                                <p>Teléfono: {athlete.AteTelef}</p>
                                <p>Dirección: {athlete.AteDirec}</p>
                                <p>Nacionalidad: {athlete.AteNacio}</p>
                                <p>Plantel Educativo: {athlete.AtePlantEst}</p>
                                <p>Grado: {athlete.AteGradoEst}</p>
                                <CButton style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }} onClick={() => handleEdit(athlete)}>Editar</CButton>
                                <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(athlete)}>Eliminar</CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Atleta</CModalTitle>
                </CModalHeader>
                <CModalBody>¿Está seguro de que desea eliminar a {selectedAthlete?.AteNombr} {selectedAthlete?.AteApell}?</CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleConfirmDelete}>Confirmar</CButton>
                </CModalFooter>
            </CModal>

            <CModal size='xl' visible={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Editar Atleta</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol md={6}>
                            <CFormInput
                                label="Nombre"
                                placeholder="Nombre"
                                value={editData.AteNombr}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteNombr: e.target.value })} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                label="Apellido"
                                placeholder="Apellido"
                                value={editData.AteApell}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteApell: e.target.value })} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={6}>
                            <CFormInput
                                label="Cedula"
                                placeholder="Cédula"
                                value={editData.AteCedul}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteCedul: e.target.value })} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                label="Fecha de Nacimiento"
                                placeholder="Fecha de Nacimiento"
                                value={editData.AteFecNa}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteFecNa: e.target.value })} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={6}>
                            <CFormInput
                                label="Telefono"
                                placeholder="Teléfono"
                                value={editData.AteTelef}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteTelef: e.target.value })} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                label="Dirrecion"
                                placeholder="Dirección"
                                value={editData.AteDirec}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteDirec: e.target.value })} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={6}>
                            <CFormInput
                                label="Nacionalidad"
                                placeholder="Nacionalidad"
                                value={editData.AteNacio}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteNacio: e.target.value })} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                label="Plantel Educativo"
                                placeholder="Plantel Educativo"
                                value={editData.AtePlantEst}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AtePlantEst: e.target.value })} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={12}>
                            <CFormInput
                                label="Grado/Año"
                                placeholder="Grado"
                                value={editData.AteGradoEst}
                                style={{ marginBottom: '15px' }}
                                onChange={(e) => setEditData({ ...editData, AteGradoEst: e.target.value })} />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setEditModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleUpdate}>Actualizar</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Athlete;