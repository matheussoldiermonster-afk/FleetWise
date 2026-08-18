import { createContext, useCallback, useContext, useRef, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: "Confirmar ação",
    message: "",
    confirmLabel: "Excluir",
  });

  const resolver = useRef(null);

  const confirm = useCallback((message, options = {}) => {
    setState({
      open: true,
      title: options.title || "Confirmar ação",
      message,
      confirmLabel: options.confirmLabel || "Excluir",
    });

    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  function handleClose(result) {
    setState((s) => ({ ...s, open: false }));
    resolver.current?.(result);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog
        open={state.open}
        onClose={() => handleClose(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle fontWeight="bold">{state.title}</DialogTitle>

        <DialogContent>
          <DialogContentText>{state.message}</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => handleClose(false)}>Cancelar</Button>

          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color="error"
          >
            {state.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
