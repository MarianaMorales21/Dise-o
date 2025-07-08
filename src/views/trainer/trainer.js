import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
import { helpHttp } from '../../helpHttp'

const Trainer = () => {
    const api = helpHttp()
    const urlEntrenadores = 'https://json-ymsx.onrender.com/TtEntre'
    const subcategorias = [
        { id: 1, name: 'Infantil' },
        { id: 2, name: 'Pre-Infantil' },
        { id: 3, name: 'Mundialito' },
        { id: 4, name: 'Compota' },
        { id: 5, name: 'Teterito' },
    ]

    const [entrenadores, setEntrenadores] = useState([])
    const [alert, setAlert] = useState({ show: false, message: '', color: '' })
    const [modalOpen, setModalOpen] = useState(false)
    const [addEntrenadorModalOpen, setAddEntrenadorModalOpen] = useState(false)
    const [editEntrenadorModalOpen, setEditEntrenadorModalOpen] = useState(false)
    const [selectedEntrenador, setSelectedEntrenador] = useState(null)
    const [newEntrenador, setNewEntrenador] = useState({
        EndNombr: '',
        EndApell: '',
        EndCedul: '',
        EndTelef: '',
        EndEspec: '',
        EndIdSubCa: 1,
    })

    useEffect(() => {
        fetchEntrenadores()
    }, [])

    const fetchEntrenadores = async () => {
        const response = await api.get(urlEntrenadores)
        if (!response.err) {
            setEntrenadores(response)
        } else {
            showAlert('Error al cargar entrenadores', 'danger')
        }
    }

    const handleAddEntrenador = async () => {
        const response = await api.post(urlEntrenadores, {
            body: newEntrenador,
        })
        if (!response.err) {
            setEntrenadores([...entrenadores, { ...newEntrenador, id: response.id }])
            showAlert('Entrenador agregado', 'success')
            setAddEntrenadorModalOpen(false)
            resetEntrenadorForm()
        } else {
            showAlert('Error al agregar entrenador', 'danger')
        }
    }

    const handleEditEntrenador = async () => {
        const response = await api.put(`${urlEntrenadores}/${selectedEntrenador.id}`, {
            body: newEntrenador,
        })
        if (!response.err) {
            setEntrenadores(
                entrenadores.map((entrenador) =>
                    entrenador.id === selectedEntrenador.id
                        ? { ...newEntrenador, id: selectedEntrenador.id }
                        : entrenador,
                ),
            )
            showAlert('Entrenador actualizado', 'success')
            setEditEntrenadorModalOpen(false)
            resetEntrenadorForm()
        } else {
            showAlert('Error al actualizar entrenador', 'danger')
        }
    }

    const handleDeleteEntrenador = async (id) => {
        const response = await api.del(`${urlEntrenadores}/${id}`)
        if (!response.err) {
            setEntrenadores(entrenadores.filter((entrenador) => entrenador.id !== id))
            showAlert('Entrenador eliminado', 'success')
        } else {
            showAlert('Error al eliminar entrenador', 'danger')
        }
    }

    const showAlert = (message, color) => {
        setAlert({ show: true, message, color })
        setTimeout(() => {
            setAlert({ show: false, message: '', color: '' })
        }, 3000)
    }

    const resetEntrenadorForm = () => {
        setNewEntrenador({
            EndNombr: '',
            EndApell: '',
            EndCedul: '',
            EndTelef: '',
            EndEspec: '',
            EndIdSubCa: 1,
        })
    }

    return (
        <CContainer>
            <h1>Lista de Entrenadores</h1>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CButton
                style={{
                    backgroundColor: 'green',
                    color: 'white',
                    marginTop: '15px',
                    marginBottom: '15px',
                }}
                onClick={() => setAddEntrenadorModalOpen(true)}
            >
                Agregar Entrenador
            </CButton>

            <CRow>
                {entrenadores.map((entrenador) => (
                    <CCol sm="6" key={entrenador.id} className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <CCardTitle>
                                    {entrenador.EndNombr} {entrenador.EndApell}
                                </CCardTitle>
                            </CCardHeader>
                            <CCardBody>
                                <p>Cédula: {entrenador.EndCedul}</p>
                                <p>Teléfono: {entrenador.EndTelef}</p>
                                <p>Estudios: {entrenador.EndEspec}</p>
                                <p>
                                    Subcategoría: {subcategorias.find((sc) => sc.id === entrenador.EndIdSubCa)?.name}
                                </p>
                                <CButton
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        marginTop: '15px',
                                        marginRight: '10px',
                                    }}
                                    onClick={() => {
                                        setSelectedEntrenador(entrenador)
                                        setNewEntrenador(entrenador)
                                        setEditEntrenadorModalOpen(true)
                                    }}
                                >
                                    Editar
                                </CButton>
                                <CButton
                                    style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }}
                                    onClick={() => {
                                        setSelectedEntrenador(entrenador)
                                        setModalOpen(true)
                                    }}
                                >
                                    Eliminar
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Eliminar Entrenador</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    ¿Está seguro de que desea eliminar a {selectedEntrenador?.EndNombr}{' '}
                    {selectedEntrenador?.EndApell}?
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }}
                        onClick={() => setModalOpen(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }}
                        onClick={() => {
                            handleDeleteEntrenador(selectedEntrenador.id)
                            setModalOpen(false)
                        }}
                    >
                        Confirmar
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={addEntrenadorModalOpen} onClose={() => setAddEntrenadorModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Agregar Entrenador</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        placeholder="Nombre"
                        label="Nombre"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndNombr}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndNombr: e.target.value })}
                    />
                    <CFormInput
                        placeholder="Apellido"
                        label="Apellido"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndApell}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndApell: e.target.value })}
                    />
                    <CFormInput
                        placeholder="Cédula"
                        label="Cedula"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndCedul}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndCedul: e.target.value })}
                    />
                    <CFormInput
                        placeholder="Teléfono"
                        label="Telefono"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndTelef}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndTelef: e.target.value })}
                    />
                    <CFormInput
                        placeholder="Estudios"
                        label="Estudios"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndEspec}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndEspec: e.target.value })}
                    />
                    <CFormSelect
                        style={{ marginBottom: '15px' }}
                        label="Subcategoria"
                        value={newEntrenador.EndIdSubCa}
                        onChange={(e) =>
                            setNewEntrenador({ ...newEntrenador, EndIdSubCa: parseInt(e.target.value) })
                        }
                    >
                        <option value="">Seleccionar Subcategoría</option>
                        {subcategorias.map((sc) => (
                            <option key={sc.id} value={sc.id}>
                                {sc.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }}
                        onClick={() => setAddEntrenadorModalOpen(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }}
                        onClick={handleAddEntrenador}
                    >
                        Agregar
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={editEntrenadorModalOpen} onClose={() => setEditEntrenadorModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Editar Entrenador</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        label="Nombre"
                        placeholder="Nombre"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndNombr}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndNombr: e.target.value })}
                    />
                    <CFormInput
                        label="Apellido"
                        placeholder="Apellido"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndApell}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndApell: e.target.value })}
                    />
                    <CFormInput
                        label="Cedula"
                        placeholder="Cédula"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndCedul}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndCedul: e.target.value })}
                    />
                    <CFormInput
                        label="Telefono"
                        placeholder="Teléfono"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndTelef}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndTelef: e.target.value })}
                    />
                    <CFormInput
                        label="Estudios"
                        placeholder="Estudios"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndEspec}
                        onChange={(e) => setNewEntrenador({ ...newEntrenador, EndEspec: e.target.value })}
                    />
                    <CFormSelect
                        label="Subcategoria"
                        style={{ marginBottom: '15px' }}
                        value={newEntrenador.EndIdSubCa}
                        onChange={(e) =>
                            setNewEntrenador({ ...newEntrenador, EndIdSubCa: parseInt(e.target.value) })
                        }
                    >
                        <option value="">Seleccionar Subcategoría</option>
                        {subcategorias.map((sc) => (
                            <option key={sc.id} value={sc.id}>
                                {sc.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }}
                        onClick={() => setEditEntrenadorModalOpen(false)}
                    >
                        Cancelar
                    </CButton>
                    <CButton
                        style={{ backgroundColor: 'green', color: 'white', marginTop: '15px' }}
                        onClick={handleEditEntrenador}
                    >
                        Actualizar
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    )
}

export default Trainer
