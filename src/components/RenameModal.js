import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { PermissionContext } from '../App';
import TextInputDialog from './Dialogs/TextInputDialog';
import { dispatchNotification } from '../Utilities/dispatcher';
import { patchRemediation } from '../api';

const EMPTY_NAME = 'Unnamed Playbook';

const RenameModal = ({
  remediation,
  setIsRenameModalOpen,
  remediationsList,
  fetch,
  onRename,
  refetch,
}) => {
  return (
    <TextInputDialog
      title="Rename remediation plan?"
      ariaLabel="RenameModal"
      value={remediation.name}
      onCancel={() => setIsRenameModalOpen(false)}
      onSubmit={async (name) => {
        setIsRenameModalOpen(false);
        await onRename(remediation.id, name);

        fetch && fetch();
        refetch && refetch();
      }}
      remediationsList={remediationsList ?? []}
      refetch={refetch}
    />
  );
};

RenameModal.propTypes = {
  remediation: PropTypes.object.isRequired,
  onRename: PropTypes.func.isRequired,
  remediationsList: PropTypes.array,
  setIsRenameModalOpen: PropTypes.func,
  fetch: PropTypes.func,
  refetch: PropTypes.func,
};

const connected = connect(null, () => ({
  onRename: (id, name) => {
    if (!name) {
      name = EMPTY_NAME;
    }
    const trimmedName = name.trim();

    return patchRemediation(id, { name: trimmedName })
      .then(() => {
        dispatchNotification({
          title: `Remediation plan renamed`,
          variant: 'success',
          dismissable: true,
          autoDismiss: true,
        });
      })
      .catch((error) => {
        console.error(error);
        dispatchNotification({
          title: `Failed to update playbook name`,
          variant: 'danger',
          dismissable: true,
          autoDismiss: true,
        });
      });
  },
}))(RenameModal);

export default connected;
