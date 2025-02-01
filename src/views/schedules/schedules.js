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
    CFormSelect,
    CForm,
} from '@coreui/react';
import { helpHttp } from '../../helpHttp.js';

const Schedule = () => {
    const api = helpHttp();
    const urlSchedules = 'http://localhost:4000/TtEntren'; // Cambia esta URL según tu API
    const urlSubcategories = 'http://localhost:4000/TmSubCa'; // Cambia esta URL según tu API
    const urlCategories = 'http://localhost:4000/TmCateg'; // Cambia esta URL según tu API

    const [trainingSchedules, setTrainingSchedules] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [formData, setFormData] = useState({
        EntrIdSubCa: '',
        EntrDiaSema: '',
        EntrHoraIni: '',
        EntrHoraFin: '',
        EntrTipo: '',
    });
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });

    useEffect(() => {
        fetchSchedules();
        fetchSubcategories();
        fetchCategories();
    }, []);

    const fetchSchedules = async () => {
        const response = await api.get(urlSchedules);
        if (!response.err) {
            setTrainingSchedules(response);
        } else {
            showAlert('Error al cargar horarios', 'danger');
        }
    };

    const fetchSubcategories = async () => {
        const response = await api.get(urlSubcategories);
        if (!response.err) {
            setSubcategories(response);
        } else {
            showAlert('Error al cargar subcategorías', 'danger');
        }
    };

    const fetchCategories = async () => {
        const response = await api.get(urlCategories);
        if (!response.err) {
            setCategories(response);
        } else {
            showAlert('Error al cargar categorías', 'danger');
        }
    };

    const getCategoryName = (subIdCat) => {
        const subcategory = subcategories.find(sub => sub.SubIdSub === subIdCat);
        if (subcategory) {
            const category = categories.find(cat => cat.CatIdCat === subcategory.SubIdCat);
            return category ? category.CatNombr : 'Sin categoría';
        }
        return 'Sin subcategoría';
    };

    const getSubcategoryName = (subIdSub) => {
        const subcategory = subcategories.find(sub => sub.SubIdSub === subIdSub);
        return subcategory ? subcategory.SubNombr : 'Sin subcategoría';
    };

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' });
        }, 3000);
    };

    const handleAdd = () => {
        setFormData({
            EntrIdSubCa: '',
            EntrDiaSema: '',
            EntrHoraIni: '',
            EntrHoraFin: '',
            EntrTipo: '',
        });
        setModalOpen(true);
    };

    const handleEdit = (schedule) => {
        setSelectedSchedule(schedule);
        setFormData({
            EntrIdSubCa: schedule.EntrIdSubCa,
            EntrDiaSema: schedule.EntrDiaSema,
            EntrHoraIni: schedule.EntrHoraIni,
            EntrHoraFin: schedule.EntrHoraFin,
            EntrTipo: schedule.EntrTipo,
        });
        setEditModalOpen(true);
    };

    const handleDelete = (schedule) => {
        setSelectedSchedule(schedule);
        setDeleteModalOpen(true);
    };

    const handleSave = async () => {
        const response = await api.post(urlSchedules, { body: { ...formData, EntrIdSubCa: parseInt(formData.EntrIdSubCa) } });
        if (!response.err) {
            setTrainingSchedules([...trainingSchedules, response]);
            showAlert('Horario agregado', 'success');
            setModalOpen(false);
        } else {
            showAlert('Error al agregar horario', 'danger');
        }
    };

    const handleUpdate = async () => {
        const response = await api.put(`${urlSchedules}/${selectedSchedule.id}`, { body: { ...formData, EntrIdSubCa: parseInt(formData.EntrIdSubCa) } });
        if (!response.err) {
            setTrainingSchedules((prev) =>
                prev.map((schedule) => (schedule.id === selectedSchedule.id ? { ...schedule, ...formData } : schedule))
            );
            showAlert('Horario actualizado', 'success');
            setEditModalOpen(false);
        } else {
            showAlert('Error al actualizar horario', 'danger');
        }
    };

    const handleConfirmDelete = async () => {
        const response = await api.del(`${urlSchedules}/${selectedSchedule.id}`);
        if (!response.err) {
            setTrainingSchedules((prev) => prev.filter((schedule) => schedule.id !== selectedSchedule.id));
            showAlert('Horario eliminado', 'success');
            setDeleteModalOpen(false);
        } else {
            showAlert('Error al eliminar horario', 'danger');
        }
    };

    return (
        <CContainer>
            <h1>Horarios de Entrenamiento</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}

            <CButton type="button" style={{ backgroundColor: 'green', color: 'white', marginBottom: '20px' }} onClick={handleAdd}>
                Agregar Horario
            </CButton>

            <CRow>
                {trainingSchedules.map(schedule => (
                    <CCol sm="6" md="4" key={schedule.id} className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <CCardTitle>{getSubcategoryName(schedule.EntrIdSubCa)} - {getCategoryName(schedule.EntrIdSubCa)}</CCardTitle>
                            </CCardHeader>
                            <CCardBody>
                                <p>Día: {schedule.EntrDiaSema}</p>
                                <p>Hora de Inicio: {schedule.EntrHoraIni}</p>
                                <p>Hora de Fin: {schedule.EntrHoraFin}</p>
                                <p>Tipo: {schedule.EntrTipo}</p>
                                <CButton style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }} onClick={() => handleEdit(schedule)}>
                                    Editar
                                </CButton>
                                <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(schedule)}>
                                    Eliminar
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Horario</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormSelect label="Subcategoría" required onChange={(e) => setFormData({ ...formData, EntrIdSubCa: e.target.value })}>
                            <option>Seleccione una subcategoría...</option>
                            {subcategories.map(subcategory => {
                                const category = categories.find(cat => cat.CatIdCat === subcategory.SubIdCat);
                                return (
                                    <option key={subcategory.SubIdSub} value={subcategory.SubIdSub}>
                                        {subcategory.SubNombr} - {category ? category.CatNombr : 'Sin categoría'}
                                    </option>
                                );
                            })}
                        </CFormSelect>
                        <CFormInput
                            type="time"
                            label="Hora de Inicio"
                            placeholder="Selecciona la hora de inicio"
                            onChange={(e) => setFormData({ ...formData, EntrHoraIni: e.target.value })}
                        />
                        <CFormInput
                            type="time"
                            label="Hora de Fin"
                            placeholder="Selecciona la hora de fin"
                            onChange={(e) => setFormData({ ...formData, EntrHoraFin: e.target.value })}
                        />
                        <CFormSelect label="Día de la Semana" onChange={(e) => setFormData({ ...formData, EntrDiaSema: e.target.value })}>
                            <option>Día...</option>
                            <option>Lunes</option>
                            <option>Martes</option>
                            <option>Miércoles</option>
                            <option>Jueves</option>
                            <option>Viernes</option>
                        </CFormSelect>
                        <CFormSelect label="Tipo de Entrenamiento" onChange={(e) => setFormData({ ...formData, EntrTipo: e.target.value })}>
                            <option>Tipo...</option>
                            <option>Técnico</option>
                            <option>Estrategia</option>
                            <option>Físico</option>
                        </CFormSelect>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setModalOpen(false)}>
                        Cancelar
                    </CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleSave}>
                        Agregar Horario
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Editar Horario</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormSelect label="Subcategoría" required value={formData.EntrIdSubCa} onChange={(e) => setFormData({ ...formData, EntrIdSubCa: e.target.value })}>
                            <option>Seleccione una subcategoría...</option>
                            {subcategories.map(subcategory => {
                                const category = categories.find(cat => cat.CatIdCat === subcategory.SubIdCat);
                                return (
                                    <option key={subcategory.SubIdSub} value={subcategory.SubIdSub}>
                                        {subcategory.SubNombr} - {category ? category.CatNombr : 'Sin categoría'}
                                    </option>
                                );
                            })}
                        </CFormSelect>
                        <CFormInput
                            type="time"
                            label="Hora de Inicio"
                            value={formData.EntrHoraIni}
                            onChange={(e) => setFormData({ ...formData, EntrHoraIni: e.target.value })}
                        />
                        <CFormInput
                            type="time"
                            label="Hora de Fin"
                            value={formData.EntrHoraFin}
                            onChange={(e) => setFormData({ ...formData, EntrHoraFin: e.target.value })}
                        />
                        <CFormSelect label="Día de la Semana" value={formData.EntrDiaSema} onChange={(e) => setFormData({ ...formData, EntrDiaSema: e.target.value })}>
                            <option>Día...</option>
                            <option>Lunes</option>
                            <option>Martes</option>
                            <option>Miércoles</option>
                            <option>Jueves</option>
                            <option>Viernes</option>
                        </CFormSelect>
                        <CFormSelect label="Tipo de Entrenamiento" value={formData.EntrTipo} onChange={(e) => setFormData({ ...formData, EntrTipo: e.target.value })}>
                            <option>Tipo...</option>
                            <option>Técnico</option>
                            <option>Estrategia</option>
                            <option>Físico</option>
                        </CFormSelect>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setEditModalOpen(false)}>
                        Cancelar
                    </CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleUpdate}>
                        Actualizar Horario
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Horario</CModalTitle>
                </CModalHeader>
                <CModalBody>¿Está seguro de que desea eliminar el horario de {selectedSchedule?.id}?</CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setDeleteModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleConfirmDelete}>Confirmar</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Schedule;