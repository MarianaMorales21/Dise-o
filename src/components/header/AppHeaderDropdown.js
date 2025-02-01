import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilLockLocked,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link } from 'react-router-dom';
import avatar8 from './../../assets/images/avatars/8.jpg';

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem as={Link} to="/Profile">
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem as={Link} to="/login">
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesion
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;