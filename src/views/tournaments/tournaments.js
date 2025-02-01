import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CContainer,
    CRow,
    CCol,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormSelect,
    CFormInput,
    CAlert
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { helpHttp } from '../../helpHttp';

const Tournaments = () => {
    const api = helpHttp();
    const urlTournaments = 'https://json-ymsx.onrender.com/TmTorneo';
    const urlTeams = 'https://json-ymsx.onrender.com/TmEquip';
    const urlTournamentTeams = 'https://json-ymsx.onrender.com/TtTorneoEqu';
    const urlCategories = 'https://json-ymsx.onrender.com/TmCateg';
    const urlSubcategories = 'https://json-ymsx.onrender.com/TmSubCa';

    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tournamentTeams, setTournamentTeams] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [addTournamentModalOpen, setAddTournamentModalOpen] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [newTeamId, setNewTeamId] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [newTournament, setNewTournament] = useState({
        TorNombr: '',
        TorLugar: '',
        TorFecIni: '',
        TorFecFin: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
    const [teamsModalOpen, setTeamsModalOpen] = useState(false);

    useEffect(() => {
        fetchTournaments();
        fetchTeams();
        fetchTournamentTeams();
        fetchCategories();
        fetchSubcategories();
    }, []);

    const fetchTournaments = async () => {
        const response = await api.get(urlTournaments);
        if (!response.err) {
            setTournaments(response);
        } else {
            showAlert('Error al cargar torneos', 'danger');
        }
    };

    const fetchTeams = async () => {
        const response = await api.get(urlTeams);
        console.log(response);
        if (!response.err) {
            setTeams(response);
        } else {
            showAlert('Error al cargar equipos', 'danger');
        }
    };

    const fetchTournamentTeams = async () => {
        const response = await api.get(urlTournamentTeams);
        if (!response.err) {
            setTournamentTeams(response);
        } else {
            showAlert('Error al cargar equipos de torneos', 'danger');
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

    const fetchSubcategories = async () => {
        const response = await api.get(urlSubcategories);
        if (!response.err) {
            setSubcategories(response);
        } else {
            showAlert('Error al cargar subcategorías', 'danger');
        }
    };

    const handleAddTeam = async () => {
        const response = await api.post(urlTournamentTeams, {
            body: {
                TorEquIdTorneo: selectedTournament.TorIdTorneo,
                TorEquIdEqu: parseInt(newTeamId, 10)
            }
        });
        if (!response.err) {
            showAlert('Equipo agregado al torneo', 'success');
            setNewTeamId('');
            fetchTournamentTeams();
            setAddTeamModalOpen(false); // Close the add team modal after adding
        } else {
            showAlert('Error al agregar equipo', 'danger');
        }
    };

    const handleDeleteTeam = async (teamId) => {
        const response = await api.del(`${urlTournamentTeams}/${teamId}`);
        if (!response.err) {
            showAlert('Equipo eliminado del torneo', 'success');
            fetchTournamentTeams();
        } else {
            showAlert('Error al eliminar equipo', 'danger');
        }
    };

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' });
        }, 3000);
    };

    const getAvailableTeams = () => {
        if (!selectedTournament) return [];
        const tournamentTeamIds = tournamentTeams
            .filter(t => t.TorEquIdTorneo === selectedTournament.TorIdTorneo)
            .map(t => t.TorEquIdEqu);
        return teams.filter(team => !tournamentTeamIds.includes(team.EquIdEqui));
    };

    const handleAddTournament = async () => {
        const response = await api.post(urlTournaments, {
            body: newTournament
        });
        if (!response.err) {
            showAlert('Torneo agregado exitosamente', 'success');
            setAddTournamentModalOpen(false);
            setNewTournament({
                TorNombr: '',
                TorLugar: '',
                TorFecIni: '',
                TorFecFin: ''
            });
            fetchTournaments();
        } else {
            showAlert('Error al agregar torneo', 'danger');
        }
    };

    const handleShowTeams = (tournament) => {
        setSelectedTournament(tournament);
        setTeamsModalOpen(true);
    };

    return (
        <CContainer>
            <h1>Torneos</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}

            <CButton
                style={{ backgroundColor: 'green', color: 'white', marginBottom: '15px' }}
                onClick={() => setAddTournamentModalOpen(true)}
            >
                Agregar Torneo
            </CButton>

            <CRow>
                {tournaments.map((tournament) => (
                    <CCol sm="4" key={tournament.TorIdTorneo} className="mb-3">
                        <CCard>
                            <CCardHeader>
                                <CCardTitle>{tournament.TorNombr}</CCardTitle>
                            </CCardHeader>
                            <CCardBody>
                                <p><strong>Lugar:</strong> {tournament.TorLugar}</p>
                                <p><strong>Fecha de Inicio:</strong> {tournament.TorFecIni}</p>
                                <p><strong>Fecha de Fin:</strong> {tournament.TorFecFin}</p>
                                <CButton
                                    style={{ backgroundColor: 'green', marginRight: '10px', color: 'white' }}
                                    onClick={() => handleShowTeams(tournament)}
                                >
                                    Equipos
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CModal visible={addTournamentModalOpen} onClose={() => setAddTournamentModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Torneo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormInput
                            type="text"
                            placeholder="Nombre del Torneo"
                            value={newTournament.TorNombr}
                            onChange={(e) => setNewTournament({ ...newTournament, TorNombr: e.target.value })}
                        />
                        <CFormInput
                            type="text"
                            placeholder="Lugar del Torneo"
                            value={newTournament.TorLugar}
                            onChange={(e) => setNewTournament({ ...newTournament, TorLugar: e.target.value })}
                        />
                        <CFormInput
                            type="date"
                            placeholder="Fecha de Inicio"
                            value={newTournament.TorFecIni}
                            onChange={(e) => setNewTournament({ ...newTournament, TorFecIni: e.target.value })}
                        />
                        <CFormInput
                            type="date"
                            placeholder="Fecha de Fin"
                            value={newTournament.TorFecFin}
                            onChange={(e) => setNewTournament({ ...newTournament, TorFecFin: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setAddTournamentModalOpen(false)}
                    >
                        Cerrar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleAddTournament}
                    >
                        Agregar Torneo
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={teamsModalOpen} onClose={() => setTeamsModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Equipos en Torneo {selectedTournament?.TorNombr}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ul>
                        {tournamentTeams
                            .filter(t => t.TorEquIdTorneo === selectedTournament?.TorIdTorneo)
                            .map((tournamentTeam) => {
                                const team = teams.find(t => t.EquIdEqui === tournamentTeam.TorEquIdEqu);
                                return (
                                    <li key={tournamentTeam.TorEquId}>
                                        {team ? team.EquNombre : 'Equipo no encontrado'}
                                    </li>
                                );
                            })}
                    </ul>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setTeamsModalOpen(false)}
                    >
                        Cerrar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', marginRight: '10px', color: 'white' }}
                        onClick={() => {
                            setAddTeamModalOpen(true);
                            setTeamsModalOpen(false);
                        }}
                    >
                        Agregar Equipo
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={addTeamModalOpen} onClose={() => setAddTeamModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Equipo a {selectedTournament?.TorNombr}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormSelect
                            value={newTeamId}
                            onChange={(e) => setNewTeamId(e.target.value)}
                        >
                            <option value="">Seleccione un equipo</option>
                            {getAvailableTeams().map((team) => (
                                <option key={team.EquIdEqui} value={team.EquIdEqui}>
                                    {team.EquNombre}
                                </option>
                            ))}
                        </CFormSelect>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setAddTeamModalOpen(false)}
                    >
                        Cerrar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleAddTeam}
                        on
                        disabled={!newTeamId}
                    >
                        Agregar Equipo
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Atención</CModalTitle>
                </CModalHeader>
                <CModalBody>¿Desea borrar este equipo del torneo?</CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setDeleteModalVisible(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={() => {
                            handleDeleteTeam(selectedTournament.TorEquId);
                            setDeleteModalVisible(false);
                        }}
                    >
                        Borrar
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Tournaments;
