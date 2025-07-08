import React, { useState } from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CFormSelect,
    CCol,
    CContainer,
    CAlert,
    CRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle
} from '@coreui/react';
import { helpHttp } from '../../helpHttp';

const Inscriptions = () => {
    const api = helpHttp();
    const urlAthletes = 'https://json-ymsx.onrender.com/TtAtlet';
    const urlRepresentatives = 'https://json-ymsx.onrender.com/TtRepres';
    const urlInscription = 'https://json-ymsx.onrender.com/TmInscr';

    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        fechaNac: '',
        operaciones: '',
        alergias: '',
        sangre: '',
        nacionalidad: '',
        plantel: '',
        grado: '',
        turno: '',
        beca: '',
        repCedula: '',
        repNombre: '',
        repApellido: '',
        repDireccionTrabajo: '',
        repDireccionHogar: '',
        repOcupacion: '',
        repTelefono: '',
    });

    const [modalVisible, setModalVisible] = useState(false);

    const generateId = () => {
        return Math.floor(Math.random() * 14);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const checkRepresentative = async (cedula) => {
        try {
            if (!cedula) return;

            const response = await api.get(`${urlRepresentatives}?RepCedul=${cedula}`);
            if (response && response.length > 0) {
                const rep = response[0];
                setFormData((prevData) => ({
                    ...prevData,
                    repNombre: rep.RepNombr || '',
                    repApellido: rep.RepApell || '',
                    repDireccionTrabajo: rep.RepDirec || '',
                    repDireccionHogar: rep.RepDirec || '',
                    repOcupacion: rep.RepParen || '',
                    repTelefono: rep.RepTelef || '',
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    repNombre: '',
                    repApellido: '',
                    repDireccionTrabajo: '',
                    repDireccionHogar: '',
                    repOcupacion: '',
                    repTelefono: '',
                }));
            }
        } catch (error) {
            console.error('Error fetching representative:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validar que la cédula no esté repetida
            const existingAthlete = await api.get(`${urlAthletes}?AteCedul=${formData.cedula}`);
            if (existingAthlete && existingAthlete.length > 0) {
                showAlert('Ya existe un atleta registrado con esa cédula.', 'danger');
                return;
            }

            let repId = null;

            const repResponse = await api.get(`${urlRepresentatives}?RepCedul=${formData.repCedula}`);
            if (repResponse && repResponse.length > 0) {
                repId = repResponse[0].RepIdRep;
            } else {
                const newRepResponse = await api.post(urlRepresentatives, {
                    body: {
                        RepCedul: formData.repCedula,
                        RepNombr: formData.repNombre,
                        RepApell: formData.repApellido,
                        RepDirec: formData.repDireccionTrabajo,
                        RepTelef: formData.repTelefono,
                        RepParen: formData.repOcupacion,
                    },
                });
                if (!newRepResponse.err) {
                    repId = newRepResponse.RepIdRep;
                } else {
                    showAlert('Error al agregar representante. Intenta nuevamente.', 'danger');
                    return;
                }
            }

            const athleteResponse = await api.post(urlAthletes, {
                body: {
                    AteIdAtl: generateId(),
                    AteNombr: formData.nombre,
                    AteApell: formData.apellido,
                    AteCedul: formData.cedula,
                    AteFecNa: formData.fechaNac,
                    AteAlergias: formData.alergias,
                    AteCondMed: formData.operaciones,
                    AteTipoSang: formData.sangre,
                    AteNacio: formData.nacionalidad,
                    AtePlantEst: formData.plantel,
                    AteGradoEst: formData.grado,
                    AteTelef: formData.repTelefono,
                    RepIdRep: repId,
                },
            });

            if (!athleteResponse.err) {
                const athleteId = athleteResponse.AteIdAtl;
                const inscriptionData = {
                    InsIdIns: generateId(),
                    InsIdAtl: athleteId,
                    InsFecIn: new Date().toISOString().split('T')[0],
                    InsEstIns: 'activa',
                };

                const inscriptionResponse = await api.post(urlInscription, { body: inscriptionData });

                if (!inscriptionResponse.err) {
                    showAlert('¡Atleta registrado exitosamente!', 'success');
                    showModal();
                    resetForm();
                } else {
                    showAlert('Error al registrar inscripción. Intenta nuevamente.', 'danger');
                }
            } else {
                showAlert('Error al registrar atleta. Intenta nuevamente.', 'danger');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            showAlert('Ocurrió un error. Intenta nuevamente.', 'danger');
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            apellido: '',
            cedula: '',
            fechaNac: '',
            operaciones: '',
            alergias: '',
            sangre: '',
            nacionalidad: '',
            plantel: '',
            grado: '',
            turno: '',
            beca: '',
            repCedula: '',
            repNombre: '',
            repApellido: '',
            repDireccionTrabajo: '',
            repDireccionHogar: '',
            repOcupacion: '',
            repTelefono: '',
        });
    };

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' });
        }, 3000);
    };

    const showModal = () => {
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
        }, 3000);
    };

    return (
        <CContainer>
            <h1>Inscripción</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CForm onSubmit={handleSubmit}>
                <h5>Datos de atleta</h5>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Nombre" name="nombre" label="Nombre" value={formData.nombre} onChange={handleInputChange} required />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput placeholder="Apellido" name="apellido" label="Apellido" value={formData.apellido} onChange={handleInputChange} required />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Cédula" name="cedula" label="Cédula" value={formData.cedula} onChange={handleInputChange} required />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput placeholder="Fecha Nacimiento" name="fechaNac" label="Fecha Nacimiento" value={formData.fechaNac} onChange={handleInputChange} required />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Operaciones" name="operaciones" label="Operaciones" value={formData.operaciones} onChange={handleInputChange} />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput placeholder="Alergias" name="alergias" label="Alergias" value={formData.alergias} onChange={handleInputChange} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormSelect name="sangre" label="Tipo Sangre" value={formData.sangre} onChange={handleInputChange}>
                            <option>Opciones...</option>
                            <option>O+</option>
                            <option>O-</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                        <CFormSelect name="nacionalidad" label="Nacionalidad" value={formData.nacionalidad} onChange={handleInputChange}>
                            <option>Opciones...</option>
                            <option>Venezuela</option>
                            <option>Peru</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Plantel de estudio" name="plantel" label="Plantel de estudio" value={formData.plantel} onChange={handleInputChange} />
                    </CCol>
                    <CCol md={6}>
                        <CFormSelect name="turno" label="Turno" value={formData.turno} onChange={handleInputChange}>
                            <option>Opciones...</option>
                            <option>Mañana</option>
                            <option>Tarde</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormSelect name="grado" label="Grado" value={formData.grado} onChange={handleInputChange}>
                            <option>Opciones...</option>
                            <option>1er Grado</option>
                            <option>2do Grado</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                        <CFormSelect name="beca" label="Beca" value={formData.beca} onChange={handleInputChange}>
                            <option>Opciones...</option>
                            <option>Activa</option>
                            <option>Inactiva</option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                <h5 style={{ marginTop: '15px' }}>Datos de Representante</h5>
                <CRow>
                    <CCol md={6}>
                        <CFormInput
                            placeholder="Cédula"
                            name="repCedula"
                            label="Cédula"
                            value={formData.repCedula}
                            onChange={(e) => {
                                handleInputChange(e);
                                checkRepresentative(e.target.value);
                            }}
                            required
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput placeholder="Nombre" name="repNombre" label="Nombre" value={formData.repNombre} onChange={handleInputChange} required />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Apellido" name="repApellido" label="Apellido" value={formData.repApellido} onChange={handleInputChange} required />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput placeholder="Dirección Trabajo" name="repDireccionTrabajo" label="Dirección Trabajo" value={formData.repDireccionTrabajo} onChange={handleInputChange} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Dirección Hogar" name="repDireccionHogar" label="Dirección Hogar" value={formData.repDireccionHogar} onChange={handleInputChange} />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput placeholder="Ocupación" name="repOcupacion" label="Ocupación" value={formData.repOcupacion} onChange={handleInputChange} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput placeholder="Teléfono" name="repTelefono" label="Teléfono" value={formData.repTelefono} onChange={handleInputChange} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={12}>
                        <CButton type="submit" style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }}>
                            Guardar Inscripción
                        </CButton>
                    </CCol>
                </CRow>
            </CForm>

            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Inscripción Registrada</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    La inscripción se ha registrado exitosamente.
                </CModalBody>
                <CModalFooter>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Inscriptions;