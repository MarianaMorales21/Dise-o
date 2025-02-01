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

const Person = () => {
    const api = helpHttp();
    const urlRepresentatives = 'https://json-ymsx.onrender.com/TtRepres';

    const [representatives, setRepresentatives] = useState([]);
    const [filteredRepresentatives, setFilteredRepresentatives] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [editData, setEditData] = useState({
        RepNombr: '',
        RepApell: '',
        RepCedul: '',
        RepDirec: '',
        RepTelef: '',
        RepParen: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRepresentatives();
    }, []);

    useEffect(() => {
        setFilteredRepresentatives(
            representatives.filter(rep =>
                rep.RepCedul.includes(searchQuery)
            )
        );
    }, [searchQuery, representatives]);

    const fetchRepresentatives = async () => {
        const response = await api.get(urlRepresentatives);
        if (!response.err) {
            setRepresentatives(response);
            setFilteredRepresentatives(response);
        } else {
            showAlert('Error al cargar representantes', 'danger');
        }
    };

    const handleEdit = (rep) => {
        setSelectedRepresentative(rep);
        setEditData(rep);
        setEditModalOpen(true);
    };

    const handleDelete = (rep) => {
        setSelectedRepresentative(rep);
        setModalOpen(true);
    };

    const handleUpdate = async () => {
        const response = await api.put(`${urlRepresentatives}/${selectedRepresentative.RepIdRep}`, {
            body: editData,
        });
        if (!response.err) {
            setRepresentatives((prev) =>
                prev.map((rep) => (rep.RepIdRep === selectedRepresentative.RepIdRep ? { ...rep, ...editData } : rep))
            );
            showAlert('Representante actualizado', 'success');
            setEditModalOpen(false);
        } else {
            showAlert('Error al actualizar representante', 'danger');
        }
    };

    const handleConfirmDelete = async () => {
        const response = await api.del(`${urlRepresentatives}/${selectedRepresentative.RepIdRep}`);
        if (!response.err) {
            setRepresentatives((prev) => prev.filter((rep) => rep.RepIdRep !== selectedRepresentative.RepIdRep));
            showAlert('Representante eliminado', 'success');
            setModalOpen(false);
        } else {
            showAlert('Error al eliminar representante', 'danger');
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
            <h1>Lista de Representantes</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CFormInput
                type="search"
                placeholder="Buscar Cédula"
                style={{ marginBottom: '15px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <CRow>
                {filteredRepresentatives.map((rep) => (
                    <CCol sm="6" key={rep.RepIdRep} className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <CCardTitle>{rep.RepNombr} {rep.RepApell}</CCardTitle>
                            </CCardHeader>
                            <CCardBody>
                                <p>Cédula: {rep.RepCedul}</p>
                                <p>Dirección: {rep.RepDirec}</p>
                                <p>Teléfono: {rep.RepTelef}</p>
                                <p>Parentesco: {rep.RepParen}</p>
                                <CButton style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }} onClick={() => handleEdit(rep)}>Editar</CButton>
                                <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(rep)}>Eliminar</CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Representante</CModalTitle>
                </CModalHeader>
                <CModalBody>¿Está seguro de que desea eliminar a {selectedRepresentative?.RepNombr} {selectedRepresentative?.RepApell}?</CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleConfirmDelete}>Confirmar</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Editar Representante</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre"
                        placeholder="Nombre"
                        value={editData.RepNombr}
                        style={{ marginBottom: '15px' }}
                        onChange={(e) => setEditData({ ...editData, RepNombr: e.target.value })} />
                    <CFormInput
                        label="Apellido"
                        placeholder="Apellido"
                        value={editData.RepApell}
                        style={{ marginBottom: '15px' }}
                        onChange={(e) => setEditData({ ...editData, RepApell: e.target.value })} />
                    <CFormInput
                        label="Cedula"
                        placeholder="Cédula"
                        value={editData.RepCedul}
                        style={{ marginBottom: '15px' }}
                        onChange={(e) => setEditData({ ...editData, RepCedul: e.target.value })} />
                    <CFormInput
                        label="Dirrecion"
                        placeholder="Dirección"
                        value={editData.RepDirec}
                        style={{ marginBottom: '15px' }}
                        onChange={(e) => setEditData({ ...editData, RepDirec: e.target.value })} />
                    <CFormInput
                        label="Telefono"
                        placeholder="Teléfono"
                        value={editData.RepTelef}
                        style={{ marginBottom: '15px' }}
                        onChange={(e) => setEditData({ ...editData, RepTelef: e.target.value })} />
                    <CFormInput
                        label="Parentesco"
                        placeholder="Parentesco"
                        value={editData.RepParen}
                        style={{ marginBottom: '15px' }}
                        onChange={(e) => setEditData({ ...editData, RepParen: e.target.value })} />
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setEditModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleUpdate}>Actualizar</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Person;