import { deleteRemediation, loadRemediationStatus } from '../actions';
import { connect } from 'react-redux';
import { loadRemediations, deleteRemediationIssue } from '../actions';

import DeleteButton from '../components/DeleteButton';

export const DeleteRemediationsButton = connect(
  () => ({
    dialogMessage: `Deleting a remediation plan is permanent and cannot be undone.`,
  }),
  (dispatch, { remediations }) => ({
    onDelete: async () => {
      await Promise.all(
        remediations.map((r) => dispatch(deleteRemediation(r)))
      );
      dispatch(loadRemediations());
    },
  })
)(DeleteButton);

export const DeleteActionsButton = connect(
  (state, { issues }) => ({
    label: `Remove action${issues.length > 1 ? 's' : ''}`,
    dialogTitle: `Remove action${issues.length > 1 ? 's' : ''}`,
    dialogConfirmationText: `Remove action${issues.length > 1 ? 's' : ''}`,
  }),
  (dispatch, { remediation, issues, afterDelete, isBeta }) => ({
    onDelete: async () => {
      await Promise.all(
        issues.map((issueId) =>
          dispatch(deleteRemediationIssue(remediation.id, issueId))
        )
      );
      if (isBeta) {
        dispatch(loadRemediationStatus(remediation.id));
      }

      afterDelete();
    },
  })
)(DeleteButton);
