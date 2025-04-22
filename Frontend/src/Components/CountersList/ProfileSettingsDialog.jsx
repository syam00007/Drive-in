import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Typography,
  Box,
  Divider,
  Tooltip,
  Chip,
  useTheme,
  Fade,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import CPForm from './CPForm';

// ConfirmationDialog Component (merged into the same file)
const ConfirmationDialog = ({ open, title, message, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ py: 2, px: 3 }}>
        {title}
      </DialogTitle>
      <Box sx={{ py: 2, px: 3 }}>
        <Typography id="alert-dialog-description">{message}</Typography>
      </Box>
      <Box sx={{ py: 2, px: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => onClose(false)} color="inherit">
          Cancel
        </Button>
        <Button onClick={() => onClose(true)} color="error" variant="contained" autoFocus>
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};

// InfoRow component displays a label (with an appended colon) and its value in a consistent row.
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', mb: 1 }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>
      {label} :
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value || "-"}
    </Typography>
  </Box>
);

// Section component groups rows with a title and a divider below.
const Section = ({ title, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
    <Typography variant="subtitle1" fontWeight="600" color="text.secondary">
      {title}
    </Typography>
    <Box sx={{ mt: 1, mb: 1 }}>{children}</Box>
    <Divider sx={{ my: 2 }} />
  </Box>
);

// Main ProfileSettingsDialog Component.
const ProfileSettingsDialog = ({ profile, open, onClose, onUpdate, onDelete }) => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Switch into edit mode
  const handleEnterEditMode = () => setEditMode(true);
  // Cancel edit mode
  const handleCancelEdit = () => setEditMode(false);

  const handleSuccess = () => {
    setEditMode(false);
    onUpdate();
    onClose();
  };

  const handleDeleteConfirmation = async (confirmed) => {
    setShowDeleteDialog(false);
    if (confirmed) {
      await onDelete(profile.id);
      onUpdate();
      onClose();
    }
  };

  // A small indicator chip for profile status.
  const StatusIndicator = ({ status }) => (
    <Chip
      label={status}
      size="small"
      avatar={
        <Avatar sx={{ bgcolor: 'transparent' }}>
          {status === 'Active' ? (
            <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />
          ) : (
            <Warning fontSize="small" sx={{ color: theme.palette.warning.main }} />
          )}
        </Avatar>
      }
      sx={{
        ml: 1,
        borderRadius: 1,
        backgroundColor:
          status === 'Active' ? theme.palette.success.light : theme.palette.warning.light,
        color: status === 'Active' ? theme.palette.success.dark : theme.palette.warning.dark,
      }}
    />
  );

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="md"
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: theme.shadows[6],
          }
        }}
      >
        <DialogTitle
          sx={{
            px: 4,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
           bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderBottom: editMode ? "none" : "1px solid #eee",
          }}
        >
          
          <Typography variant="h6" component="div" fontWeight="600" >
            Counter Profile Management
          </Typography>
         
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!editMode && (
              <>
                
                <Tooltip title="Edit Profile" arrow>
                  <IconButton 
                    onClick={handleEnterEditMode} 
                    color="inherit"
                    sx={{ mr: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Profile" arrow>
                  <IconButton 
                    onClick={() => setShowDeleteDialog(true)}
                    color="inherit"
                    sx={{ mr: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="Close" arrow>
              <IconButton 
                onClick={onClose} 
                color="inherit"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{ p: 4, bgcolor: theme.palette.background.paper }}
          dividers={!editMode}
        >
          {editMode ? (
            <CPForm profile={profile} onSuccess={handleSuccess} onCancel={handleCancelEdit} />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Section title="Basic Information">
                <InfoRow label="Counter Name" value={profile.counterName} />
                <InfoRow label="Owner Name" value={profile.owner} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Mobile Number" value={profile.mobileNumber} />
              </Section>
              <Section title="Operational Statistics">
                <InfoRow 
                  label="Counter Status" 
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                   {/*    {profile.status} */}
                      <StatusIndicator status={profile.status} />
                    </Box>
                  } 
                />
                <InfoRow label="Today's Orders" value="50" />
                <InfoRow label="Amount Received Today" value={profile.amountToday} />
              </Section>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showDeleteDialog}
        title="Confirm Profile Deletion"
        message="Are you sure you want to permanently delete this counter profile? This action cannot be undone."
        onClose={handleDeleteConfirmation}
      />
    </>
  );
};

export default ProfileSettingsDialog;
