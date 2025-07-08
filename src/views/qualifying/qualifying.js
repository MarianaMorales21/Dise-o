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
    CFormSelect,
    CForm
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { helpHttp } from '../../helpHttp';

const SubCategory = () => {
    const api = helpHttp();
    const urlAthletes = 'https://json-ymsx.onrender.com/TtAtlet';
    const urlTeams = 'https://json-ymsx.onrender.com/TmEquip';
    const urlCategories = 'https://json-ymsx.onrender.com/TmCateg';
    const urlSubCategories = 'https://json-ymsx.onrender.com/TmSubCa';
    const urlTeamAthletes = 'https://json-ymsx.onrender.com/TtEquAtl';

    const [modalOpen, setModalOpen] = useState(false);
    const [addAthleteModalOpen, setAddAthleteModalOpen] = useState(false);
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [addSubCategoryModalOpen, setAddSubCategoryModalOpen] = useState(false);
    const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
    const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
    const [deleteSubCategoryModalOpen, setDeleteSubCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryForSubCategory, setSelectedCategoryForSubCategory] = useState(null);
    const [selectedSubCategoryForTeam, setSelectedSubCategoryForTeam] = useState(null);
    const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);
    const [selectedSubCategoryForDelete, setSelectedSubCategoryForDelete] = useState(null);
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

    // Estados para nuevas categorías, subcategorías y equipos
    const [newCategory, setNewCategory] = useState({
        CatNombr: '',
        CatDescr: ''
    });
    const [newSubCategory, setNewSubCategory] = useState({
        SubNombr: '',
        SubDescr: ''
    });
    const [newTeam, setNewTeam] = useState({
        EquNombre: '',
        EquDescr: ''
    });

    useEffect(() => {
        fetchCategories();
        fetchTeams();
        fetchAthletes();
        fetchSubCategories();
        fetchTeamAthletes();
    }, []);

    const fetchCategories = async () => {
        const response = await api.get(urlCategories);
        if (!response.err) {
            setCategories(response);
        }
    };

    const fetchTeams = async () => {
        const response = await api.get(urlTeams);
        if (!response.err) {
            setTeams(response);
        }
    };

    const fetchAthletes = async () => {
        const response = await api.get(urlAthletes);
        if (!response.err) {
            setAthletes(response);
        }
    };

    const fetchSubCategories = async () => {
        const response = await api.get(urlSubCategories);
        if (!response.err) {
            setSubCategories(response);
        }
    };

    const fetchTeamAthletes = async () => {
        const response = await api.get(urlTeamAthletes);
        if (!response.err) {
            setTeamAthletesData(response);
        }
    };

    const generateId = () => Math.floor(Math.random() * 10000);

    // Validaciones para eliminar
    const canDeleteCategory = (categoryId) => {
        const hasSubCategories = subCategories.some(sub => sub.SubIdCat === categoryId);
        return !hasSubCategories;
    };

    const canDeleteSubCategory = (subCategoryId) => {
        const team = teams.find(team => team.EquIdSubC === subCategoryId);
        if (!team) return true;

        const hasAthletes = teamAthletesData.some(ta => ta.EquAtlIdEqu === team.EquIdEqui);
        return !hasAthletes;
    };

    // Función para agregar categoría
    const handleAddCategory = async () => {
        const response = await api.post(urlCategories, { body: newCategory });
        if (!response.err) {
            showAlert('Categoría agregada exitosamente', 'success');
            setAddCategoryModalOpen(false);
            setNewCategory({ CatNombr: '', CatDescr: '' });
            fetchCategories();
        } else {
            showAlert('Error al agregar categoría', 'danger');
        }
    };

    // Función para agregar subcategoría
    const handleAddSubCategory = async () => {
        const subCategoryData = {
            ...newSubCategory,
            SubIdCat: selectedCategoryForSubCategory.CatIdCat
        };

        const response = await api.post(urlSubCategories, { body: subCategoryData });
        if (!response.err) {
            showAlert('Subcategoría agregada exitosamente', 'success');
            setAddSubCategoryModalOpen(false);
            setNewSubCategory({ SubNombr: '', SubDescr: '' });
            setSelectedCategoryForSubCategory(null);
            fetchSubCategories();
        } else {
            showAlert('Error al agregar subcategoría', 'danger');
        }
    };

    // Función para agregar equipo
    const handleAddTeam = async () => {
        const teamData = {
            ...newTeam,
            EquIdSubC: selectedSubCategoryForTeam.SubIdSub
        };

        const response = await api.post(urlTeams, { body: teamData });
        if (!response.err) {
            showAlert('Equipo agregado exitosamente', 'success');
            setAddTeamModalOpen(false);
            setNewTeam({ EquNombre: '', EquDescr: '' });
            setSelectedSubCategoryForTeam(null);
            fetchTeams();
        } else {
            showAlert('Error al agregar equipo', 'danger');
        }
    };

    // Función para eliminar categoría
    const handleDeleteCategoria = async () => {
        if (!selectedCategoryForDelete) return;

        if (!canDeleteCategory(selectedCategoryForDelete.CatIdCat)) {
            showAlert('No se puede eliminar la categoría porque tiene subcategorías asignadas', 'danger');
            setDeleteCategoryModalOpen(false);
            return;
        }

        console.log("Eliminando categoría con ID:", selectedCategoryForDelete.id);
        const response = await api.del(`${urlCategories}/${selectedCategoryForDelete.id}`);
        console.log("Respuesta de la API:", response);

        if (!response.err) {
            showAlert('Categoría eliminada exitosamente', 'success');
            setDeleteCategoryModalOpen(false);
            setSelectedCategoryForDelete(null);
            fetchCategories();
        } else {
            showAlert('Error al eliminar categoría', 'danger');
        }
    };

    // Función para eliminar subcategoría
    const handleDeleteSubcategoria = async () => {
        if (!selectedSubCategoryForDelete) return;

        if (!canDeleteSubCategory(selectedSubCategoryForDelete.SubIdSub)) {
            showAlert('No se puede eliminar la subcategoría porque tiene atletas asignados', 'danger');
            setDeleteSubCategoryModalOpen(false);
            return;
        }

        try {
            // Primero eliminar el equipo asociado si existe
            const associatedTeam = teams.find(team => team.EquIdSubC === selectedSubCategoryForDelete.SubIdSub);
            if (associatedTeam) {
                console.log("Eliminando equipo asociado con ID:", associatedTeam.id);
                await api.del(`${urlTeams}/${associatedTeam.id}`);
            }

            // Luego eliminar la subcategoría
            console.log("Eliminando subcategoría con ID:", selectedSubCategoryForDelete.id);
            const response = await api.del(`${urlSubCategories}/${selectedSubCategoryForDelete.id}`);
            console.log("Respuesta de la API:", response);

            if (!response.err) {
                showAlert('Subcategoría eliminada exitosamente', 'success');
                setDeleteSubCategoryModalOpen(false);
                setSelectedSubCategoryForDelete(null);
                fetchSubCategories();
                fetchTeams();
            } else {
                showAlert('Error al eliminar subcategoría', 'danger');
            }
        } catch (error) {
            showAlert('Error al eliminar subcategoría', 'danger');
        }
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

    const openAddSubCategoryModal = (category) => {
        setSelectedCategoryForSubCategory(category);
        setAddSubCategoryModalOpen(true);
    };

    const openAddTeamModal = (subCategory) => {
        setSelectedSubCategoryForTeam(subCategory);
        setAddTeamModalOpen(true);
    };

    const openDeleteCategoryModal = (category) => {
        setSelectedCategoryForDelete(category);
        setDeleteCategoryModalOpen(true);
    };

    const openDeleteSubCategoryModal = (subCategory) => {
        setSelectedSubCategoryForDelete(subCategory);
        setDeleteSubCategoryModalOpen(true);
    };

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
                id: generateId(),
                EquAtlId: parseInt(selectedAthleteId, 10),
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

            <CButton
                style={{ backgroundColor: 'green', color: 'white', marginBottom: '15px' }}
                onClick={() => setAddCategoryModalOpen(true)}
            >
                Agregar Categoría
            </CButton>

            <CRow>
                {categories.map((category) => (
                    <CCol sm="12" key={category.CatIdCat} className="mb-4">
                        <div style={{ border: '1px solid gray', borderRadius: '10px', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h2>{category.CatNombr}</h2>
                                <div>
                                    <CButton
                                        style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                                        onClick={() => openAddSubCategoryModal(category)}
                                    >
                                        Agregar Subcategoría
                                    </CButton>
                                    <CButton
                                        style={{ backgroundColor: 'white', color: 'red', borderColor: 'white' }}
                                        onClick={() => openDeleteCategoryModal(category)}
                                        disabled={!canDeleteCategory(category.CatIdCat)}
                                        title={!canDeleteCategory(category.CatIdCat) ? 'No se puede eliminar: tiene subcategorías asignadas' : 'Eliminar categoría'}
                                    >
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </div>
                            </div>
                            <CRow>
                                {subCategories.filter(sub => sub.SubIdCat === category.CatIdCat).map((subCategory) => (
                                    <CCol sm="6" key={subCategory.SubIdSub} className="mb-3">
                                        <CCard>
                                            <CCardHeader>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <CCardTitle>{subCategory.SubNombr}</CCardTitle>
                                                    <CButton
                                                        style={{ backgroundColor: 'white', color: 'red', borderColor: 'white' }}
                                                        onClick={() => openDeleteSubCategoryModal(subCategory)}
                                                        disabled={!canDeleteSubCategory(subCategory.SubIdSub)}
                                                        title={!canDeleteSubCategory(subCategory.SubIdSub) ? 'No se puede eliminar: tiene atletas asignados' : 'Eliminar subcategoría'}
                                                    >
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </div>
                                            </CCardHeader>
                                            <CCardBody>
                                                <p>Equipo: {teams.find(team => team.EquIdSubC === subCategory.SubIdSub)?.EquNombre || 'No asignado'}</p>

                                                {!teams.find(team => team.EquIdSubC === subCategory.SubIdSub) && (
                                                    <CButton
                                                        style={{ backgroundColor: 'green', color: 'white', marginBottom: '10px' }}
                                                        onClick={() => openAddTeamModal(subCategory)}
                                                    >
                                                        Agregar Equipo
                                                    </CButton>
                                                )}

                                                <ul>
                                                    {getAssignedAthletesForSubCategory(subCategory.SubIdSub).map((athlete) => (
                                                        <li key={athlete.AteIdAtl}>
                                                            {athlete.AteNombr} {athlete.AteApell}
                                                            <CButton
                                                                style={{ backgroundColor: 'white', color: 'red', marginLeft: '10px' }}
                                                                onClick={() => {
                                                                    setSelectedAthlete(athlete);
                                                                    setModalOpen(true);
                                                                }}
                                                            >
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {teams.find(team => team.EquIdSubC === subCategory.SubIdSub) && (
                                                    <CButton
                                                        style={{ backgroundColor: 'green', color: 'white', marginTop: '10px' }}
                                                        onClick={() => openAddAthleteModal(subCategory.SubIdSub)}
                                                    >
                                                        Agregar Atleta
                                                    </CButton>
                                                )}
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                ))}
                            </CRow>
                        </div>
                    </CCol>
                ))}
            </CRow>

            {/* Modal para agregar categoría */}
            <CModal visible={addCategoryModalOpen} onClose={() => setAddCategoryModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Categoría</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormInput
                            type="text"
                            placeholder="Nombre de la Categoría"
                            value={newCategory.CatNombr}
                            onChange={(e) => setNewCategory({ ...newCategory, CatNombr: e.target.value })}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            placeholder="Descripción de la Categoría"
                            value={newCategory.CatDescr}
                            onChange={(e) => setNewCategory({ ...newCategory, CatDescr: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setAddCategoryModalOpen(false)}
                    >
                        Cerrar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleAddCategory}
                    >
                        Agregar Categoría
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para agregar subcategoría */}
            <CModal visible={addSubCategoryModalOpen} onClose={() => setAddSubCategoryModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Subcategoría a {selectedCategoryForSubCategory?.CatNombr}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormInput
                            type="text"
                            placeholder="Nombre de la Subcategoría"
                            value={newSubCategory.SubNombr}
                            onChange={(e) => setNewSubCategory({ ...newSubCategory, SubNombr: e.target.value })}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            placeholder="Descripción de la Subcategoría"
                            value={newSubCategory.SubDescr}
                            onChange={(e) => setNewSubCategory({ ...newSubCategory, SubDescr: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setAddSubCategoryModalOpen(false)}
                    >
                        Cerrar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleAddSubCategory}
                    >
                        Agregar Subcategoría
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para agregar equipo */}
            <CModal visible={addTeamModalOpen} onClose={() => setAddTeamModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Equipo a {selectedSubCategoryForTeam?.SubNombr}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormInput
                            type="text"
                            placeholder="Nombre del Equipo"
                            value={newTeam.EquNombre}
                            onChange={(e) => setNewTeam({ ...newTeam, EquNombre: e.target.value })}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            placeholder="Descripción del Equipo"
                            value={newTeam.EquDescr}
                            onChange={(e) => setNewTeam({ ...newTeam, EquDescr: e.target.value })}
                        />
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
                    >
                        Agregar Equipo
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar categoría */}
            <CModal visible={deleteCategoryModalOpen} onClose={() => setDeleteCategoryModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Categoría</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    ¿Está seguro de que desea eliminar la categoría {selectedCategoryForDelete?.CatNombr}?
                    {!canDeleteCategory(selectedCategoryForDelete?.CatIdCat) && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            <strong>Advertencia:</strong> Esta categoría tiene subcategorías asignadas y no puede ser eliminada.
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setDeleteCategoryModalOpen(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleDeleteCategoria}
                        disabled={!canDeleteCategory(selectedCategoryForDelete?.CatIdCat)}
                    >
                        Confirmar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar subcategoría */}
            <CModal visible={deleteSubCategoryModalOpen} onClose={() => setDeleteSubCategoryModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Subcategoría</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    ¿Está seguro de que desea eliminar la subcategoría {selectedSubCategoryForDelete?.SubNombr}?
                    {!canDeleteSubCategory(selectedSubCategoryForDelete?.SubIdSub) && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            <strong>Advertencia:</strong> Esta subcategoría tiene atletas asignados y no puede ser eliminada.
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                        onClick={() => setDeleteSubCategoryModalOpen(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white' }}
                        onClick={handleDeleteSubcategoria}
                        disabled={!canDeleteSubCategory(selectedSubCategoryForDelete?.SubIdSub)}
                    >
                        Confirmar
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para eliminar atleta */}
            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Atleta</CModalTitle>
                </CModalHeader>
                <CModalBody>¿Está seguro de que desea eliminar a {selectedAthlete?.AteNombr} {selectedAthlete?.AteApell}?</CModalBody>
                <CModalFooter>
                    <CButton style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }} onClick={() => setModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={() => {
                        const athleteToDelete = teamAthletesData.find(ta => ta.EquAtlIdAtl === selectedAthlete.AteIdAtl);
                        if (athleteToDelete) {
                            handleDeleteAthlete(athleteToDelete.id);
                        }
                        setModalOpen(false);
                    }}>Confirmar</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal para agregar atleta */}
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
                    <CButton style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }} onClick={() => setAddAthleteModalOpen(false)}>Cancelar</CButton>
                    <CButton style={{ backgroundColor: 'green', color: 'white' }} onClick={handleAddAthleteToTeam}>Agregar</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default SubCategory;