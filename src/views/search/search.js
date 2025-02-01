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
    CAlert,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { helpHttp } from '../../helpHttp';

const Search = () => {
    const api = helpHttp();
    const urlRepresentatives = 'https://json-ymsx.onrender.com/TtRepres';
    const urlAthletes = 'https://json-ymsx.onrender.com/TtAtlet';
    const urlEvaluations = 'https://json-ymsx.onrender.com/TtEval';

    const [user, setUser] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        direccionHogar: '',
        ocupacion: '',
        telefono: '',
        nacionalidad: '',
    });

    const [athletes, setAthletes] = useState([]);
    const [allAthletes, setAllAthletes] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [showEvaluationModal, setShowEvaluationModal] = useState(false);
    const [newEvaluation, setNewEvaluation] = useState({
        EvalIdAtl: '',
        EvalFec: '',
        EvalVel: '',
        EvalRes: '',
        EvalDomBal: '',
        EvalPunt: '',
        EvalSaque: '',
        EvalObs: '',
    });

    useEffect(() => {
        fetchAthletes();
    }, []);

    const fetchAthletes = async () => {
        const response = await api.get(urlAthletes);
        if (!response.err) {
            setAllAthletes(response);
        } else {
            showAlert('Error al cargar los atletas', 'danger');
        }
    };

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' });
        }, 3000);
    };

    const checkRepresentative = async (cedula) => {
        try {
            if (!cedula) return;

            const response = await api.get(`${urlRepresentatives}?RepCedul=${cedula}`);
            if (response && response.length > 0) {
                const rep = response[0];
                setUser((prevData) => ({
                    ...prevData,
                    nombre: rep.RepNombr || '',
                    apellido: rep.RepApell || '',
                    direccionHogar: rep.RepDirec || '',
                    ocupacion: rep.RepParen || '',
                    telefono: rep.RepTelef || '',
                    nacionalidad: rep.RepNacio || '',
                }));

                const representativeAthletes = allAthletes.filter(athlete => athlete.RepIdRep === rep.RepIdRep);
                setAthletes(representativeAthletes);
            } else {
                setUser((prevData) => ({
                    ...prevData,
                    nombre: '',
                    apellido: '',
                    direccionHogar: '',
                    ocupacion: '',
                    telefono: '',
                    nacionalidad: '',
                }));
                setAthletes([]);
                showAlert('No se encontró el representante', 'warning');
            }
        } catch (error) {
            console.error('Error fetching representative:', error);
            showAlert('Error al buscar el representante', 'danger');
        }
    };

    const fetchEvaluations = async (athleteId) => {
        const response = await api.get(`${urlEvaluations}?EvalIdAtl=${athleteId}`);
        if (!response.err) {
            setEvaluations(response);
        } else {
            showAlert('Error al cargar las evaluaciones', 'danger');
        }
    };

    const handleDetailsClick = (athlete) => {
        setSelectedAthlete(athlete);
        fetchEvaluations(athlete.AteIdAtl);
        setShowEvaluationModal(true);
    };

    const handleAddEvaluation = async () => {
        try {
            const response = await api.post(urlEvaluations, { ...newEvaluation, EvalIdAtl: selectedAthlete.AteIdAtl });
            if (!response.err) {
                showAlert('Evaluación agregada con éxito', 'success');
                fetchEvaluations(selectedAthlete.AteIdAtl);
                setNewEvaluation({
                    EvalIdAtl: '',
                    EvalFec: '',
                    EvalVel: '',
                    EvalRes: '',
                    EvalDomBal: '',
                    EvalPunt: '',
                    EvalSaque: '',
                    EvalObs: '',
                });
            } else {
                showAlert('Error al agregar la evaluación', 'danger');
            }
        } catch (error) {
            console.error('Error adding evaluation:', error);
            showAlert('Error al agregar la evaluación', 'danger');
        }
    };

    return (
        <CContainer>
            <h1>Información del Representante</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CForm>
                <CCol md={6} style={{ marginBottom: '15px' }}>
                    <CFormInput
                        label="Cédula"
                        placeholder="Agregar Cédula para búsqueda"
                        value={user.cedula}
                        onChange={(e) => {
                            setUser({ ...user, cedula: e.target.value });
                            checkRepresentative(e.target.value);
                        }}
                    />
                </CCol>
                <CRow>
                    <CCol md={6}>
                        <CFormInput
                            label="Nombre"
                            value={user.nombre}
                            onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormSelect
                            label="Nacionalidad"
                            value={user.nacionalidad}
                            onChange={(e) => setUser({ ...user, nacionalidad: e.target.value })}
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
                            label="Apellido"
                            value={user.apellido}
                            onChange={(e) => setUser({ ...user, apellido: e.target.value })}
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            label="Dirección"
                            value={user.direccionHogar}
                            onChange={(e) => setUser({ ...user, direccionHogar: e.target.value })}
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={6}>
                        <CFormInput
                            label="Ocupación"
                            value={user.ocupacion}
                            onChange={(e) => setUser({ ...user, ocupacion: e.target.value })}
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            label="Teléfono"
                            value={user.telefono}
                            onChange={(e) => setUser({ ...user, telefono: e.target.value })}
                        />
                    </CCol>
                </CRow>
            </CForm>

            <h2 style={{ marginTop: '20px' }}>Atletas Representados</h2>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                        <CTableHeaderCell>Nombre</CTableHeaderCell>
                        <CTableHeaderCell>Apellido</CTableHeaderCell>
                        <CTableHeaderCell>Plantel de estudio</CTableHeaderCell>
                        <CTableHeaderCell>Grado/Año</CTableHeaderCell>
                        <CTableHeaderCell>Opciones</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {athletes.map((athlete) => (
                        <CTableRow key={athlete.id}>
                            <CTableDataCell>{athlete.AteIdAtl}</CTableDataCell>
                            <CTableDataCell>{athlete.AteFecNa}</CTableDataCell>
                            <CTableDataCell>{athlete.AteNombr}</CTableDataCell>
                            <CTableDataCell>{athlete.AteApell}</CTableDataCell>
                            <CTableDataCell>{athlete.AtePlantEst}</CTableDataCell>
                            <CTableDataCell>{athlete.AteGradoEst}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    style={{
                                        backgroundColor: 'green',
                                        marginRight: '10px',
                                        color: 'white',
                                    }}
                                    onClick={() => handleDetailsClick(athlete)}
                                >
                                    Detalles
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CModal size='xl' visible={showEvaluationModal} onClose={() => setShowEvaluationModal(false)}>
                <CModalHeader>
                    <CModalTitle>Evaluaciones de {selectedAthlete ? selectedAthlete.AteNombr : ''}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {evaluations.length > 0 ? (
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                                    <CTableHeaderCell>Velocidad</CTableHeaderCell>
                                    <CTableHeaderCell>Dominio Balón</CTableHeaderCell>
                                    <CTableHeaderCell>Puntuación</CTableHeaderCell>
                                    <CTableHeaderCell>Saque</CTableHeaderCell>
                                    <CTableHeaderCell>Observaciones</CTableHeaderCell>
                                    <CTableHeaderCell>Resultado</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {evaluations.map((evaluation) => (
                                    <CTableRow key={evaluation.EvalIdEval}>
                                        <CTableDataCell>{evaluation.EvalIdEval}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalFec}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalVel}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalDomBal}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalPunt}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalSaque}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalObs}</CTableDataCell>
                                        <CTableDataCell>{evaluation.EvalRes}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    ) : (
                        <p>No hay evaluaciones disponibles para este atleta.</p>
                    )}
                    {evaluations.length === 0 && (
                        <>
                            <h5>Agregar Nueva Evaluación</h5>
                            <CForm>
                                <CFormInput
                                    label="Fecha"
                                    type='date'
                                    value={newEvaluation.EvalFec}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalFec: e.target.value })}
                                />
                                <CFormInput
                                    label="Velocidad"
                                    value={newEvaluation.EvalVel}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalVel: e.target.value })}
                                />
                                <CFormInput
                                    label="Resultado"
                                    value={newEvaluation.EvalRes}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalRes: e.target.value })}
                                />
                                <CFormInput
                                    label="Dominio Balón"
                                    value={newEvaluation.EvalDomBal}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalDomBal: e.target.value })}
                                />
                                <CFormInput
                                    label="Puntuación"
                                    value={newEvaluation.EvalPunt}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalPunt: e.target.value })}
                                />
                                <CFormInput
                                    label="Saque"
                                    value={newEvaluation.EvalSaque}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalSaque: e.target.value })}
                                />
                                <CFormInput
                                    label="Observaciones"
                                    value={newEvaluation.EvalObs}
                                    onChange={(e) => setNewEvaluation({ ...newEvaluation, EvalObs: e.target.value })}
                                />
                            </CForm>
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red' }} onClick={() => setShowEvaluationModal(false)}>Cerrar</CButton>
                    {evaluations.length === 0 && (
                        <CButton style={{ backgroundColor: 'green' }} onClick={handleAddEvaluation}>Agregar Evaluación</CButton>
                    )}
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Search;