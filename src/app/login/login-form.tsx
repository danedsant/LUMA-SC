"use client";

import { useActionState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <Stack component="form" action={formAction} spacing={2.5} noValidate>
      <TextField
        id="cedula"
        name="cedula"
        label="Cédula"
        placeholder="27506542"
        autoComplete="username"
        slotProps={{ htmlInput: { inputMode: "numeric" } }}
        required
        fullWidth
      />

      <TextField
        id="password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        required
        fullWidth
      />

      {state.error ? <Alert severity="error">{state.error}</Alert> : null}

      <Button type="submit" variant="contained" size="large" disabled={pending} fullWidth>
        {pending ? "Verificando…" : "Entrar"}
      </Button>
    </Stack>
  );
}
