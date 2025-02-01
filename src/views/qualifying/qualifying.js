import React, { useState, useEffect } from 'react';
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
    CFormSelect
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { helpHttp } from '../../helpHttp';

const SubCategory = () => {
    const api = helpHttp();
    const urlAthletes = 'http://localhost:4000/TtAtlet';
    const urlTeams = 'http://localhost:4000/TmEquip';
    const urlCategories = 'http://localhost:4000/TmCateg';
    const urlSubCategories = 'http://localhost:4000/TmSubCa';
    const urlTeamAthletes = 'http://localhost:4000/TtEquAtl';

    const [modalOpen, setModalOpen] = useState(false);
    const [addAthleteModalOpen, setAddAthleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [athletes, setAthletes] = useState([]);
    const [teams, setTeams] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [availableAthletes, setAvailableAthletes] = useState([]);
    const [dorsal, setDorsal] = useState(0);
    const [position, setPosition] = useState('');
    const [selectedAthleteId, setSelectedAthleteId] = useState('');
    const [selectedAthlete, setSelectedAthlete] = useState(null);
    const [teamAthletesData, setTeamAthletesData] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchTeams();
        fetchAthletes();
        fetchSubCategories();
        fetchTeamAthletes();
    }, []);

    const fetchCategories = async () => {
        const response = await api.get(urlCategories);
        setCategories(response);
    };

    const fetchTeams = async () => {
        const response = await api.get(urlTeams);
        setTeams(response);
    };

    const fetchAthletes = async () => {
        const response = await api.get(urlAthletes);
        setAthletes(response);
    };

    const fetchSubCategories = async () => {
        const response = await api.get(urlSubCategories);
        setSubCategories(response);
    };

    const fetchTeamAthletes = async () => {
        const response = await api.get(urlTeamAthletes);
        setTeamAthletesData(response);
    };

    const handleDeleteAthlete = async (id) => {
        console.log("Eliminando atleta con ID:", id);
        const response = await api.del(`${urlTeamAthletes}/${id}`);

        console.log("Respuesta de la API:", response);

        if (!response.err) {
            showAlert('Atleta eliminado exitosamente', 'success');
            fetchAthletes();
            fetchSubCategories();
            fetchTeamAthletes();
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

    const openAddAthleteModal = (subCategoryId) => {
        setSelectedCategory(subCategoryId);
        const unassignedAthletes = athletes.filter(athlete =>
            !teamAthletesData.some(teamAthlete => teamAthlete.EquAtlIdAtl === athlete.AteIdAtl)
        );
        setAvailableAthletes(unassignedAthletes);
        setAddAthleteModalOpen(true);
        setDorsal(0);
        setPosition('');
        setSelectedAthleteId('');
    };

    const generateId = () => Math.floor(Math.random() * 10000);

    const handleAddAthleteToTeam = async () => {
        if (!selectedAthleteId) {
            showAlert('Por favor, selecciona un atleta', 'danger');
            return;
        }

        const selectedTeam = teams.find(team => team.EquIdSubC === selectedCategory);
        if (!selectedTeam) {
            showAlert('No se encontró un equipo para esta subcategoría', 'danger');
            return;
        }

        const response = await api.post(urlTeamAthletes, {
            body: {
                EquAtlId: generateId(),
                EquAtlIdAtl: parseInt(selectedAthleteId, 10),
                EquAtlIdEqu: selectedTeam.EquIdEqui,
                EquAtlRol: 'jugador',
                EquAtlPosic: position,
                EquAtlDorsal: dorsal
            }
        });

        if (!response.err) {
            showAlert('Atleta agregado al equipo exitosamente', 'success');
            fetchAthletes();
            fetchSubCategories();
            fetchTeamAthletes();
            setAddAthleteModalOpen(false);
        } else {
            showAlert('Error al agregar atleta al equipo', 'danger');
        }
    };

    const getAssignedAthletesForSubCategory = (subCategoryId) => {
        const team = teams.find(team => team.EquIdSubC === subCategoryId);
        if (!team) return [];
        return teamAthletesData.filter(ta => ta.EquAtlIdEqu === team.EquIdEqui)
            .map(ta => athletes.find(athlete => athlete.AteIdAtl === ta.EquAtlIdAtl))
            .filter(athlete => athlete);
    };

    return (
        <CContainer>
            <h1>Categorías/Subcategorías</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CRow>
                {categories.map((category) => (
                    <CCol sm="12" key={category.CatIdCat} className="mb-4">
                        <div style={{ border: '1px solid gray', borderRadius: '10px', padding: '10px' }}>
                            <h2>{category.CatNombr}</h2>
                            <CRow>
                                {subCategories.filter(sub => sub.SubIdCat === category.CatIdCat).map((subCategory) => (
                                    <CCol sm="6" key={subCategory.SubIdSub} className="mb-3">
                                        <CCard>
                                            <CCardHeader>
                                                <CCardTitle>{subCategory.SubNombr}</CCardTitle>
                                            </CCardHeader>
                                            <CCardBody>
                                                <p>Equipo: {teams.find(team => team.EquIdSubC === subCategory.SubIdSub)?.EquNombre || 'No asignado'}</p>
                                                <ul>
                                                    {getAssignedAthletesForSubCategory(subCategory.SubIdSub).map((athlete) => (
                                                        <li key={athlete.AteIdAtl}>
                                                            {athlete.AteNombr} {athlete.AteApell}
                                                            <CButton style={{ marginLeft: '10px' }} onClick={() => {
                                                                setSelectedAthlete(athlete);
                                                                setModalOpen(true);
                                                            }}>
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                ))}
                            </CRow>
                            <CButton style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }} onClick={() => openAddAthleteModal(category.CatIdCat)}>
                                Agregar Atleta
                            </CButton>
                        </div>
                    </CCol>
                ))}
            </CRow>

            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Atleta</CModalTitle>
                </CModalHeader>
                <CModalBody>¿Está seguro de que desea eliminar a {selectedAthlete?.AteNombr} {selectedAthlete?.AteApell}?</CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }} onClick={() => setModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }} onClick={() => {
                        const athleteToDelete = teamAthletesData.find(ta => ta.EquAtlIdAtl === selectedAthlete.AteIdAtl);
                        if (athleteToDelete) {
                            handleDeleteAthlete(athleteToDelete.id);
                        }
                        setModalOpen(false);
                    }}>Confirmar</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={addAthleteModalOpen} onClose={() => setAddAthleteModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Atleta</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        aria-label="Seleccionar Atleta"
                        onChange={(e) => setSelectedAthleteId(e.target.value)}
                    >
                        <option value="">Selecciona un atleta</option>
                        {availableAthletes.map(athlete => (
                            <option key={athlete.AteIdAtl} value={athlete.AteIdAtl}>
                                {athlete.AteNombr} {athlete.AteApell}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        type="number"
                        placeholder="Dorsal"
                        value={dorsal}
                        onChange={(e) => setDorsal(e.target.value)}
                        className="mt-3"
                    />
                    <CFormInput
                        type="text"
                        placeholder="Posición"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="mt-3"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }} onClick={() => setAddAthleteModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }} onClick={handleAddAthleteToTeam}>Agregar</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default SubCategory;
