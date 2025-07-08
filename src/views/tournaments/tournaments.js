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
    CAlert,
} from '@coreui/react';
import { helpHttp } from '../../helpHttp';

const Tournaments = () => {
    const api = helpHttp();
    const urlTournaments = 'https://json-ymsx.onrender.com/TmTorneo';
    const urlTeams = 'https://json-ymsx.onrender.com/TmEquip';
    const urlTournamentTeams = 'https://json-ymsx.onrender.com/TtTorneoEqu';

    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tournamentTeams, setTournamentTeams] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [newTeamId, setNewTeamId] = useState('');
    const [newTournament, setNewTournament] = useState({
        TorNombr: '',
        TorLugar: '',
        TorFecIni: '',
        TorFecFin: '',
    });
    const [alert, setAlert] = useState({ show: false, message: '', color: '' });
    const [addTournamentModalOpen, setAddTournamentModalOpen] = useState(false);
    const [deleteTournamentModalOpen, setDeleteTournamentModalOpen] = useState(false);
    const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
    const [teamsModalOpen, setTeamsModalOpen] = useState(false);

    useEffect(() => {
        fetchTournaments();
        fetchTeams();
        fetchTournamentTeams();
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

    const handleAddTournament = async () => {
        const response = await api.post(urlTournaments, { body: newTournament });
        if (!response.err) {
            showAlert('Torneo agregado exitosamente', 'success');
            setAddTournamentModalOpen(false);
            setNewTournament({ TorNombr: '', TorLugar: '', TorFecIni: '', TorFecFin: '' });
            fetchTournaments();
        } else {
            showAlert('Error al agregar torneo', 'danger');
        }
    };

    const handleDeleteTournament = async () => {
        // Verificar si el torneo tiene equipos inscritos
        const teamsInTournament = tournamentTeams.filter(tt => tt.TorEquIdTorneo === selectedTournament.TorIdTorneo);
        if (teamsInTournament.length > 0) {
            showAlert('No se puede eliminar el torneo porque tiene equipos inscritos', 'danger');
            return;
        }

        const response = await api.del(`${urlTournaments}/${selectedTournament.id}`);
        if (!response.err) {
            showAlert('Torneo eliminado', 'success');
            setDeleteTournamentModalOpen(false);
            fetchTournaments();
        } else {
            showAlert('Error al eliminar torneo', 'danger');
        }
    };

    const handleShowTeams = (tournament) => {
        setSelectedTournament(tournament);
        setTeamsModalOpen(true);
    };

    const handleAddTeam = async () => {
        const newTournamentTeam = {
            TorEquIdTorneo: selectedTournament.TorIdTorneo,
            TorEquIdEqu: parseInt(newTeamId)
        };

        const response = await api.post(urlTournamentTeams, { body: newTournamentTeam });
        if (!response.err) {
            showAlert('Equipo agregado al torneo exitosamente', 'success');
            setAddTeamModalOpen(false);
            setNewTeamId('');
            fetchTournamentTeams();
            setTeamsModalOpen(true);
        } else {
            showAlert('Error al agregar equipo al torneo', 'danger');
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

    const getAvailableTeams = () => {
        if (!selectedTournament) return teams;

        const teamsInTournament = tournamentTeams
            .filter(tt => tt.TorEquIdTorneo === selectedTournament.TorIdTorneo)
            .map(tt => tt.TorEquIdEqu);

        return teams.filter(team => !teamsInTournament.includes(team.EquIdEqui));
    };

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' });
        }, 3000);
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
                                <CButton
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                    onClick={() => {
                                        setSelectedTournament(tournament);
                                        setDeleteTournamentModalOpen(true);
                                    }}
                                >
                                    Eliminar Torneo
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            {/* Modal para agregar torneo */}
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
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            placeholder="Lugar del Torneo"
                            value={newTournament.TorLugar}
                            onChange={(e) => setNewTournament({ ...newTournament, TorLugar: e.target.value })}
                            className="mb-3"
                        />
                        <CFormInput
                            type="date"
                            placeholder="Fecha de Inicio"
                            value={newTournament.TorFecIni}
                            onChange={(e) => setNewTournament({ ...newTournament, TorFecIni: e.target.value })}
                            className="mb-3"
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

            {/* Modal para eliminar torneo */}
            <CModal visible={deleteTournamentModalOpen} onClose={() => setDeleteTournamentModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Torneo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    ¿Está seguro de que desea eliminar el torneo {selectedTournament?.TorNombr}?
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setDeleteTournamentModalOpen(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleDeleteTournament}
                    >
                        Confirmar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para mostrar equipos en el torneo */}
            <CModal visible={teamsModalOpen} onClose={() => setTeamsModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Equipos en Torneo {selectedTournament?.TorNombr}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {tournamentTeams
                            .filter((t) => t.TorEquIdTorneo === selectedTournament?.TorIdTorneo)
                            .map((tournamentTeam) => {
                                const team = teams.find((t) => t.EquIdEqui === tournamentTeam.TorEquIdEqu);
                                return (
                                    <li key={tournamentTeam.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px',
                                        borderBottom: '1px solid #eee'
                                    }}>
                                        <span>{team ? team.EquNombre : 'Equipo no encontrado'}</span>
                                        <CButton
                                            style={{ backgroundColor: 'red', color: 'white' }}
                                            size="sm"
                                            onClick={() => handleDeleteTeam(tournamentTeam.id)}
                                        >
                                            Eliminar
                                        </CButton>
                                    </li>
                                );
                            })}
                        {tournamentTeams.filter((t) => t.TorEquIdTorneo === selectedTournament?.TorIdTorneo).length === 0 && (
                            <li style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                No hay equipos en este torneo
                            </li>
                        )}
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

            {/* Modal para agregar equipo */}
            <CModal visible={addTeamModalOpen} onClose={() => setAddTeamModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Equipo a {selectedTournament?.TorNombr}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormSelect value={newTeamId} onChange={(e) => setNewTeamId(e.target.value)}>
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
                        onClick={() => {
                            setAddTeamModalOpen(false);
                            setNewTeamId('');
                        }}
                    >
                        Cerrar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleAddTeam}
                        disabled={!newTeamId}
                    >
                        Agregar Equipo
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default Tournaments;
